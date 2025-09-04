import { Injectable } from '@nestjs/common';
import { LivekitService } from '../libs/livekit/livekit.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { TelegramService } from '../libs/telegram/telegram.service';
import { StripeService } from '../libs/stripe/stripe.service';
import Stripe from 'stripe'
import { TransactionStatus } from '@/generated';


@Injectable()
export class WebhookService {
    public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly livekitService: LivekitService,
        private readonly notificationService: NotificationService,
		private readonly telegramService: TelegramService,
		private readonly stripeService: StripeService
	) {}


    public async receiveWebhookLivekit(body: string, authorization: string) {
		const event = await this.livekitService.receiver.receive(
			body,
			authorization,
			true
		)

		if (event.event === 'ingress_started') {
			const stream = await this.prismaService.stream.update({
				where: {
					ingressId: event.ingressInfo?.ingressId
				},
				data: {
					isLive: true
				},
				include: {
					user: true
				}
			})

			const followers = await this.prismaService.follow.findMany({
				where: {
					followingId: stream.user?.id,
					follower: {
						isDeactivated: false
					}
				},
				include: {
					follower: {
						include: {
							notificationSettings: true
						}
					}
				}
			})

            for( const follow of followers){
                const follower = follow.follower
                 
                if (!stream.user) continue;


                if(follower.notificationSettings?.siteNotifications){
                    await this.notificationService.createStreamStart(follower.id,stream.user)
                }

                if (
                    follower.notificationSettings?.telegramNotifications &&
                    follower.telegramId
                  ) {
                    await this.telegramService.sendStreamStart(
                      follower.telegramId,
                      stream.user
                    )
                  }
                  
            }

		}

		if (event.event === 'ingress_ended') {
			const stream = await this.prismaService.stream.update({
				where: {
					ingressId: event.ingressInfo?.ingressId
				},
				data: {
					isLive: false
				}
			})

			await this.prismaService.chatMessage.deleteMany({
				where: {
					streamId: stream.id
				}
			})
		}
	}



	
	public async receiveWebhookStripe(event: Stripe.Event) {
		const session = event.data.object as Stripe.Checkout.Session
	
		if (!session.metadata) {
			return
		}
	
		const { planId, userId, channelId } = session.metadata;
	
		if (!planId || !userId || !channelId) {
			console.error('Missing required metadata in webhook session');
			return;
		}
	
		if (event.type === 'checkout.session.completed') {
			const expiresAt = new Date()
			expiresAt.setDate(expiresAt.getDate() + 30)
	
			const sponsorshipSubscription =
				await this.prismaService.sponsorshipSubscription.create({
					data: {
						expiresAt,
						planId,
						userId,
						channelId
					},
					include: {
						plan: true,
						user: true,
						channel: {
							include: {
								notificationSettings: true
							}
						}
					}
				})
	
			await this.prismaService.transaction.updateMany({
				where: {
					stripeSubscriptionId: session.id,
					status: TransactionStatus.PENDING
				},
				data: {
					status: TransactionStatus.SUCCESS
				}
			})
	
			const channel = sponsorshipSubscription.channel;
			const plan = sponsorshipSubscription.plan;
			const user = sponsorshipSubscription.user;
			const notificationSettings = channel?.notificationSettings;
			
			if (channel && plan && user && notificationSettings?.siteNotifications) {
				await this.notificationService.createNewSponsorship(
					channel.id,
					plan,
					user
				)
			}
			
			if (
				channel && 
				plan && 
				user &&
				notificationSettings?.telegramNotifications && 
				channel.telegramId
			) {
				await this.telegramService.sendNewSponsorship(
					channel.telegramId,
					plan,
					user
				)
			}
		}
	
		if (event.type === 'checkout.session.expired') {
			await this.prismaService.transaction.updateMany({
				where: {
					stripeSubscriptionId: session.id
				},
				data: {
					status: TransactionStatus.EXPIRED
				}
			})
		}
	
		if (event.type === 'checkout.session.async_payment_failed') {
			await this.prismaService.transaction.updateMany({
				where: {
					stripeSubscriptionId: session.id
				},
				data: {
					status: TransactionStatus.FAILED
				}
			})
		}
	}
	
	public constructStripeEvent(payload: any, signature: any) {
		return this.stripeService.webhooks.constructEvent(
			payload,
			signature,
			this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET')
		)
	}





}

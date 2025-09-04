import { PrismaService } from '@/src/core/prisma/prisma.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { StripeService } from '../../libs/stripe/stripe.service';
import { User } from '@/generated';
import { CreatePlanInput } from './inputs/create-plan.input';

@Injectable()
export class PlanService {

    public constructor(
		private readonly prismaService: PrismaService,
		private readonly stripeService: StripeService
	) {}


    public async findMyPlans(user:User){
        const plans = await this.prismaService.sponsorshipPlan.findMany({
             where:{
                channelId:user.id
             }
        })


        return plans
    }


    public async create(user:User,input:CreatePlanInput){
        const {title,description,price} = input

        const channel = await this.prismaService.user.findUniqueOrThrow({
            where: {
              id: user.id
            }
          })
          

		if (!channel.isVerified) {
			throw new ForbiddenException(
				'Creating plans is available only to verified channels'
			)
		}


        let stripePlan;

        try {
          stripePlan = await this.stripeService.plans.create({
            amount: Math.round(price * 100),
            currency: 'rub',
            interval: 'month',
            product: { name: title }
          });
        } catch (error) {
          console.error('Error when creating a plan:', error);
          throw new Error('Failed to create a plan in Stripee');
        }
        
        if (!stripePlan) {
          throw new Error('Stripe Returned an empty answernswernswernswernswer');
        }
        

        
		await this.prismaService.sponsorshipPlan.create({
			data: {
				title,
				description,
				price,
				stripeProductId: stripePlan.product.toString(),
				stripePlanId: stripePlan.id,
				channel: {
					connect: {
						id: user.id
					}
				}
			}
		})

		return true


    }


    
	public async remove(planId: string) {
		const plan = await this.prismaService.sponsorshipPlan.findUnique({
			where: {
				id: planId
			}
		})

		if (!plan) {
			throw new NotFoundException('Plan not nail')
		}

		await this.stripeService.plans.del(plan.stripePlanId)
		await this.stripeService.products.del(plan.stripeProductId)

		await this.prismaService.sponsorshipPlan.delete({
			where: {
				id: plan.id
			}
		})

		return true
	}


}

import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { PrismaService } from '@/src/core/prisma/prisma.service'
import { User } from '@/generated'

import { SendMessageInput } from './inputs/send-message.input'
import { ChangeChatSettingsInput } from './inputs/change-chat-setting.input'
import { KafkaProducerService } from '../kafka/kafka-producer.service'


@Injectable()
export class ChatService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly kafkaProducer: KafkaProducerService
	) {}

	public async findByStream(streamId: string) {
		const messages = await this.prismaService.chatMessage.findMany({
			where: {
				streamId
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				user: true
			}
		})

		return messages
	}

	public async sendMessage(userId: string, input: SendMessageInput) {
		const { text, streamId } = input

		const stream = await this.prismaService.stream.findUnique({
			where: {
				id: streamId
			}
		})

		if (!stream) {
			throw new NotFoundException('Stream not found')
		}

		if (!stream.isLive) {
			throw new BadRequestException(
				'Stream is not in live broadcasting mode'
			)
		}

		const message = await this.prismaService.chatMessage.create({
			data: {
				text,
				user: {
					connect: {
						id: userId
					}
				},
				stream: {
					connect: {
						id: streamId 
					}
				}
			},
			include: {
				stream: true,
				user: true
			}
		})

		await this.kafkaProducer.sendChatMessage({
			messageId: message.id,
			userId: message.userId,
			streamId: message.streamId,
			text: message.text,
			createdAt: message.createdAt,
			user: {
				id: message.user.id,
				username: message.user.username
			}
		})

		return message
	}

	public async changeSettings(user: User, input: ChangeChatSettingsInput) {
		const {
			isChatEnabled,
			isChatFollowersOnly,
			isChatPremiumFollowersOnly
		} = input

		await this.prismaService.stream.update({
			where: {
				userId: user.id
			},
			data: {
				isChatEnabled,
				isChatFollowersOnly,
				isChatPremiumFollowersOnly
			}
		})

		// Отправляем событие в Kafka
		await this.kafkaProducer.sendChatSettingsChanged({
			userId: user.id,
			settings: input,
			updatedAt: new Date()
		})

		return true
	}
}

// import {
// 	BadRequestException,
// 	Injectable,
// 	NotFoundException
// } from '@nestjs/common'
// import { connect } from 'http2'

// import { PrismaService } from '@/src/core/prisma/prisma.service'

// import { SendMessageInput } from './inputs/send-message.input'
// import { ChangeChatSettingsInput } from './inputs/change-chat-setting.input'
// import { User } from '@/generated'

// @Injectable()
// export class ChatService {
// 	public constructor(private readonly prismaService: PrismaService) {}

// 	public async findByStream(streamId: string) {
// 		const messages = await this.prismaService.chatMessage.findMany({
// 			where: {
// 				streamId
// 			},
// 			orderBy: {
// 				createdAt: 'desc'
// 			},
// 			include: {
// 				user: true
// 			}
// 		})

// 		return messages
// 	}

// 	public async sendMessage(userId: string, input: SendMessageInput) {
// 		const { text, streamId } = input

// 		const stream = await this.prismaService.stream.findUnique({
// 			where: {
// 				id: streamId
// 			}
// 		})

// 		if (!stream) {
// 			throw new NotFoundException('Stream not found')
// 		}

// 		if (!stream.isLive) {
// 			throw new BadRequestException(
// 				'Stream is not in live broadcasting mode'
// 			)
// 		}

// 		const message = await this.prismaService.chatMessage.create({
// 			data: {
// 				text,
// 				user: {
// 					connect: {
// 						id: userId
// 					}
// 				},
// 				stream: {
// 					connect: {
// 						id: userId
// 					}
// 				}
// 			},
// 			include: {
// 				stream: true,
// 				user: true
// 			}
// 		})

// 		return message
// 	}


    
// 	public async changeSettings(user: User, input: ChangeChatSettingsInput) {
// 		const {
// 			isChatEnabled,
// 			isChatFollowersOnly,
// 			isChatPremiumFollowersOnly
// 		} = input

// 		await this.prismaService.stream.update({
// 			where: {
// 				userId: user.id
// 			},
// 			data: {
// 				isChatEnabled,
// 				isChatFollowersOnly,
// 				isChatPremiumFollowersOnly
// 			}
// 		})

// 		return true
// 	}
// }

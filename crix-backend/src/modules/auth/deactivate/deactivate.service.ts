import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'

import { TokenType, User } from '@/generated'
import { PrismaService } from '@/src/core/prisma/prisma.service'
import { RedisService } from '@/src/core/redis/redis.service'
import { destroySession } from '@/src/shared/utils/session.util'

import { MailService } from '../../libs/mail/mail.service'
import { generateToken } from '@/src/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.utils'
import { DeactivateAccountInput } from './inputs/deactivate-account.input'
import { verify } from 'argon2'
import { TelegramService } from '../../libs/telegram/telegram.service'

@Injectable()
export class DeactivateService {
	public constructor(
		private readonly prismaService: PrismaService,
		private configService: ConfigService,
		private readonly mailService: MailService,
		private readonly redisService: RedisService,
		private readonly telegramService: TelegramService
	) {}

    public async deactivate(
		req: Request,
		input: DeactivateAccountInput,
		user: User,
		userAgent: string
	) {
		const { email, password, pin } = input

		if (user.email !== email) {
			throw new BadRequestException('Неверная почта')
		}

		const isValidPassword = await verify(user.password, password)

		if (!isValidPassword) {
			throw new BadRequestException('Неверный пароль')
		}

		if (!pin) {
			await this.sendDeactivateToken(req, user, userAgent)

			return { message: 'Confirmation code is required' }
		}

		await this.validateDeactivateToken(req, pin)

		return { user }
	}


	private async validateDeactivateToken(req: Request, token: string) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.DEACTIVATE_ACCOUNT
			}
		})

		if (!existingToken) {
			throw new NotFoundException('Token was not found')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Token')
		}

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.userId ?? ''
			},
			data: {
				isDeactivated: true,
				deactivatedAt: new Date()
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.DEACTIVATE_ACCOUNT
			}
		})

		await this.clearSessions(user.id)

		return destroySession(req, this.configService)
	}

    
	private async sendDeactivateToken(
		req: Request,
		user: User,
		userAgent: string
	) {
		const deactivateToken = await generateToken(
			this.prismaService,
			user,
			TokenType.DEACTIVATE_ACCOUNT,
			false
		)

		const metadata = getSessionMetadata(req, userAgent)

		await this.mailService.sendDeactivateToken(
			user.email,
			deactivateToken.token,
			metadata
		)


		if (
			deactivateToken.user &&
			deactivateToken.user.notificationSettings?.telegramNotifications &&
			deactivateToken.user.telegramId
		  ) {
			await this.telegramService.sendDeactivateToken(
			  deactivateToken.user.telegramId,
			  deactivateToken.token,
			  metadata
			)
		  }
		  

		return true
	}

	private async clearSessions(userId: string) {
		const keys = await this.redisService.keys('*')

		for (const key of keys) {
			const sessionData = await this.redisService.get(key)

			if (sessionData) {
				const session = JSON.parse(sessionData)

				if (session.userId === userId) {
					await this.redisService.del(key)
				}
			}
		}
	}
}

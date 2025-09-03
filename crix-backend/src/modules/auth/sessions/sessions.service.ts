import { PrismaService } from '@/src/core/prisma/prisma.service';
import { RedisService } from '@/src/core/redis/redis.service';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.utils';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import { LoginInput } from './inputs/login.input';
import type { Request } from 'express';
import { SessionMetadata } from '@/src/shared/types/session-metadata';
import { destroySession, saveSession } from '@/src/shared/utils/session.util';
import { SessionData } from 'express-session';
import { User } from '@/generated';
import { VerificationService } from '../verification/verification.service';
import { TOTP } from 'otpauth'




@Injectable()
export class SessionsService {
    public constructor(private readonly prismaService:PrismaService,private readonly redisService: RedisService,
		private readonly configService: ConfigService,
		private readonly verificationService: VerificationService
    ){}

	public async findByUser(req: Request): Promise<Array<SessionData & { id: string }>> {
		const userId = req.session.userId
	
		if (!userId) {
			throw new NotFoundException('The user is not found in the session')
		}
	
		const keys = await this.redisService.keys('*')
		const userSessions: Array<SessionData & { id: string }> = []
	
		for (const key of keys) {
			const sessionData = await this.redisService.get(key)
	
			if (sessionData) {
				try {
					const session: SessionData = JSON.parse(sessionData)
	
					if (session.userId === userId) {
						userSessions.push({
							...session,
							id: key.split(':')[1]
						})
					}
				} catch (error) {
					console.error(`Parsing session for a key ${key}:`, error)
				}
			}
		}
	
		userSessions.sort((a, b) => {
			const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt || 0).getTime()
			const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt || 0).getTime()
			return bTime - aTime
		})
	
		return userSessions.filter(session => session.id !== req.session.id)
	}

	  public async findCurrent(req: Request) {
		const sessionId = req.session.id;
	  
		const sessionData = await this.redisService.get(
		  `${this.configService.getOrThrow<string>('SESSION_FOLDER')}${sessionId}`
		);
	  
		if (!sessionData) {
		  throw new NotFoundException('Session not found');
		}
	  
		const session = JSON.parse(sessionData);
	  
		return {
		  ...session,
		  id: sessionId,
		};
	  }
	  
	  
    
	  public async login(req: Request, input: LoginInput, userAgent: string) {
		const { login, password ,pin} = input

		console.log('Login input:', input);

		const user = await this.prismaService.user.findFirst({
			where: {
				OR: [
					{ username: { equals: login, mode: 'insensitive' } },
					{ email: { equals: login, mode: 'insensitive' } }
				]
			}
		})
	
		if (!user || user.isDeactivated) {
			throw new NotFoundException('The user was not found')
		}
	
		const isValidPassword = await verify(user.password, password)
	
		if (!isValidPassword) {
			throw new UnauthorizedException('Wrong password')
		}

		if (!user.isEmailVerified) {
			await this.verificationService.sendVerificationToken(user)

			throw new BadRequestException(
				'The account is not verified.Please check your mail to confirm'
			)
		}

		if(user.isTotpEnabled){
			if(!pin){
				return {
					message:'A code is required to complete the authorization'
				}
			}

			const totp = new TOTP({
				issuer:"Crix",
				label:`${user.email}`,
				algorithm:"SHA1",
				digits:6,
				secret:user.totpSecret ?? ''
			})

			const delta = totp.validate({token:pin})

			if(delta === null){
				throw new BadRequestException("Inappropriate code")
			}

		}
	
		const metadata = getSessionMetadata(req, userAgent)

		return saveSession(req, user, metadata)
	}

	
		  public async logout(req: Request) {
			return destroySession(req, this.configService)
		}
	
		public async clearSession(req: Request) {
			req.res?.clearCookie(
				this.configService.getOrThrow<string>('SESSION_NAME')
			)
	
			return true
		}
	
		public async remove(req: Request, id: string) {
			if (req.session.id === id) {
				throw new ConflictException('The current session cannot be deleted')
			}
	
			await this.redisService.del(
				`${this.configService.getOrThrow<string>('SESSION_FOLDER')}${id}`
			)
	
			return true
		}

	
}

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { MailService } from '../../libs/mail/mail.service';
import type { Request } from 'express';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { generateToken } from '@/src/shared/utils/generate-token.util';
import { TokenType } from '@/generated';
import { getSessionMetadata } from '@/src/shared/utils/session-metadata.utils';
import { hash } from 'argon2';
import { NewPasswordInput } from './inputs/new-password.input';

@Injectable()
export class PasswordRecoveryService {
    public constructor(
        private readonly prismaService:PrismaService,
        private readonly mailService:MailService
    ){}


    public async resetPassword(req:Request,input:ResetPasswordInput,userAgent:string){
        const {email} = input

        const user = await this.prismaService.user.findUnique({
            where:{
                email
            },
            include:{
                notificationSettings:true
            }
        })

        if (!user) {
			throw new NotAcceptableException('The user was not found')
		}

        const resetToken = await  generateToken(this.prismaService,user,TokenType.PASSWORD_RESET)

        const metadata = getSessionMetadata(req,userAgent)


        await this.mailService.sendPasswordResetToken(user.email,resetToken.token,metadata)


        return true

    }



    
	public async newPassword(input: NewPasswordInput) {
		const { password, token } = input

		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.PASSWORD_RESET
			}
		})

		if (!existingToken) {
			throw new NotFoundException('Token was not found')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Token')
		}

		await this.prismaService.user.update({
			where: {
				id: existingToken.userId ?? ''
			},
			data: {
				password: await hash(password)
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.PASSWORD_RESET
			}
		})

		return true
	}


}

import { PrismaService } from '@/src/core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { MailService } from '../libs/mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
    public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		// private readonly notificationService: NotificationService,
		// private readonly telegramService: TelegramService,
		// private readonly storageService: StorageService
	) {}


    @Cron(CronExpression.EVERY_10_SECONDS)
    public async deleteDeactiveAccount(){
        const sevenDaysAgo = new Date()
		sevenDaysAgo.setDate(sevenDaysAgo.getSeconds() - 10)


        const deactivateAccounts = await this.prismaService.user.findMany({
            where:{
                isDeactivated:true,
                deactivatedAt:{
                     lte:sevenDaysAgo
                }
            }
        })

        for(const user of deactivateAccounts){
            await this.mailService.sendAcccountDeletion(user.email)
        }

        await this.prismaService.user.deleteMany({
            where:{
                isDeactivated:true,
                deactivatedAt:{
                    lte:sevenDaysAgo
                }
            }
        })
          
    }
}

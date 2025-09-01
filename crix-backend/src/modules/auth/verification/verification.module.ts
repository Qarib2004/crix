import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { PrismaService } from '@/src/core/prisma/prisma.service';
import { MailModule } from '../../libs/mail/mail.module';

@Module({
  imports: [MailModule], 
  providers: [VerificationResolver, VerificationService, PrismaService],
  exports: [VerificationService],
})
export class VerificationModule {}

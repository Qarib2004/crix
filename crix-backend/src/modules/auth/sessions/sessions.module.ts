import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsResolver } from './sessions.resolver';
import { VerificationService } from '../verification/verification.service';

@Module({
  providers: [SessionsResolver, SessionsService,VerificationService],
})
export class SessionsModule {}

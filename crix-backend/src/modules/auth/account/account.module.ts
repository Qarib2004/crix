import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountResolver } from './account.resolver';
import { VerificationModule } from '../verification/verification.module';

@Module({
  imports: [VerificationModule], 
  providers: [AccountResolver, AccountService],
})
export class AccountModule {}

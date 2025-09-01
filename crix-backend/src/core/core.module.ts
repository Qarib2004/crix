import { ApolloDriver } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { AccountModule } from '../modules/auth/account/account.module'
import { SessionsModule } from '../modules/auth/sessions/sessions.module'
import { IS_DEV_ENV } from '../shared/utils/is-dev.util'

import { getGraphQLConfig } from './config/graphql.config'
import { PrismaModule } from './prisma/prisma.module'
import { RedisModule } from './redis/redis.module'
import { VerificationModule } from '../modules/auth/verification/verification.module'
import { PasswordRecoveryModule } from '../modules/auth/password-recovery/password-recovery.module'
import { TotpModule } from '../modules/auth/totp/totp.module'
import { DeactivateModule } from '../modules/auth/deactivate/deactivate.module'
import { CronModule } from '../modules/cron/cron.module'
import { StorageModule } from '../modules/libs/storage/storage.module'
import { ProfileModule } from '../modules/auth/profile/profile.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		PrismaModule,
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			imports: [ConfigModule],
			useFactory: getGraphQLConfig,
			inject: [ConfigService]
		}),
		RedisModule,
		AccountModule,
		SessionsModule,
		CronModule,
		VerificationModule,
		PasswordRecoveryModule,
		TotpModule,
		DeactivateModule,
		StorageModule,
		ProfileModule
	]
})
export class CoreModule {}

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
import { StreamModule } from '../modules/stream/stream.module'
import { LivekitModule } from '../modules/libs/livekit/livekit.module'
import { getLiveKitConfig } from './config/livekit.config'
import { IngressModule } from '../modules/stream/ingress/ingress.module'
import { WebhookModule } from '../modules/webhook/webhook.module'
import { CategoryModule } from '../modules/category/category.module'
import { ChatModule } from '../modules/chat/chat.module'
import { FollowModule } from '../modules/follow/follow.module'
import { ChannelModule } from '../modules/channel/channel.module'
import { NotificationModule } from '../modules/notification/notification.module'
import { TelegramModule } from '../modules/libs/telegram/telegram.module'

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
		LivekitModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getLiveKitConfig,
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
		ProfileModule,
		StreamModule,
		LivekitModule,
		IngressModule,
		WebhookModule,
		CategoryModule,
		ChatModule,
		FollowModule,
		ChannelModule,
		NotificationModule,
		TelegramModule
	]
})
export class CoreModule {}

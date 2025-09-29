import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { KafkaProducerService } from './kafka-producer.service'
import { ConfigModule, ConfigService } from '@nestjs/config'


@Module({
	imports: [
		ClientsModule.registerAsync([
			{
				name: 'KAFKA_SERVICE',
				imports: [ConfigModule],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.KAFKA,
					options: {
						client: {
							clientId: configService.get('KAFKA_CLIENT_ID') || 'crix-chat-service',
							brokers: [configService.get('KAFKA_BROKER') || 'localhost:9092']
						},
						consumer: {
							groupId: configService.get('KAFKA_CONSUMER_GROUP_ID') || 'crix-chat-consumer-group'
						}
					}
				}),
				inject: [ConfigService]
			}
		])
	],
	providers: [KafkaProducerService],
	exports: [KafkaProducerService]
})
export class KafkaModule {}
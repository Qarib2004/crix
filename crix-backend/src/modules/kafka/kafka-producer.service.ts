import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'

@Injectable()
export class KafkaProducerService implements OnModuleInit {
	public constructor(
		@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
	) {}

	async onModuleInit() {
		await this.kafkaClient.connect()
	}

	public async sendChatMessage(message: any) {
		return this.kafkaClient.emit('chat.message.created', message)
	}

	public async sendChatSettingsChanged(data: any) {
		return this.kafkaClient.emit('chat.settings.changed', data)
	}
}
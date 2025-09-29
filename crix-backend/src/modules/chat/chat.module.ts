import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports:[KafkaModule],
  providers: [ChatResolver, ChatService],
  exports:[ChatService]
})
export class ChatModule {}

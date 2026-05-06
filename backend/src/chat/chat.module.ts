import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RetrieverService } from './rag/retriever.service';
import { PromptService } from './rag/prompt.service';


@Module({
  controllers: [ChatController],
  providers: [ChatService, RetrieverService, PromptService],
})
export class ChatModule {}
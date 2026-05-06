import {
  Controller,
  Post,
  Body,
  Sse,
  Logger,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ChatService, ChatResponse } from './chat.service';
import { ChatMessage } from './rag/prompt.service';


class ChatMessageDto implements ChatMessage {
  @IsString()
  role!: 'user' | 'assistant';

  @IsString()
  content!: string;
}

class ChatRequestDto {
  @IsString()
  message!: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  history?: ChatMessage[];
}


@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post()
  @Sse()
  @UsePipes(new ValidationPipe({ transform: true }))
  chat(@Body() body: ChatRequestDto): Observable<MessageEvent> {
    const { message, history = [] } = body;

    this.logger.log(`Nueva query: "${message.substring(0, 50)}..."`);

    return this.chatService.chat(message, history).pipe(
      map((response: ChatResponse) => {
        return {
          data: response,
        } as MessageEvent;
      }),
    );
  }
}
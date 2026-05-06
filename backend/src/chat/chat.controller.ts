import {
  Controller,
  Post,
  Body,
  Logger,
  ValidationPipe,
  UsePipes,
  HttpCode,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ChatService } from './chat.service';
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
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  async chat(
    @Body() body: ChatRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const { message, history = [] } = body;

    this.logger.log(`Nueva query: "${message.substring(0, 50)}..."`);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    const stream$ = this.chatService.chat(message, history);

    stream$.subscribe({
      next: (event) => {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      },
      error: (err) => {
        this.logger.error('Error en stream:', err);
        res.write(`data: ${JSON.stringify({ type: 'error', content: 'Error interno' })}\n\n`);
        res.end();
      },
      complete: () => {
        res.end();
      },
    });
  }
}
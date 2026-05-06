import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { RetrieverService } from './rag/retriever.service';
import { PromptService, ChatMessage } from './rag/prompt.service';
import { Observable, Subject } from 'rxjs';


export interface ChatResponse {
  type: 'token' | 'sources' | 'done' | 'error';
  content?: string;
  sources?: Array<{ topic: string; source: string }>;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly llm: ChatOpenAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly retrieverService: RetrieverService,
    private readonly promptService: PromptService,
  ) {
    this.llm = new ChatOpenAI({
      model: this.configService.get<string>('openai.chatModel')!,
      openAIApiKey: this.configService.get<string>('openai.apiKey')!,
      streaming: true,      
      temperature: 0.7,     
                            
    });
  }

  chat(query: string, history: ChatMessage[]): Observable<ChatResponse> {
    const subject = new Subject<ChatResponse>();

    this.runPipeline(query, history, subject).catch((error) => {
      this.logger.error('Error en pipeline RAG:', error);
      subject.next({ type: 'error', content: 'Ocurrió un error al procesar tu consulta.' });
      subject.complete();
    });

    return subject.asObservable();
  }

  private async runPipeline(
    query: string,
    history: ChatMessage[],
    subject: Subject<ChatResponse>,
  ): Promise<void> {

    this.logger.debug(`[RAG] Buscando contexto para: "${query}"`);
    const relevantDocs = await this.retrieverService.retrieve(query);

    const sources = relevantDocs.map((doc) => ({
      topic: doc.metadata?.topic ?? 'general',
      source: doc.metadata?.source ?? 'desconocida',
    }));

    subject.next({ type: 'sources', sources });

    const context = this.promptService.buildContext(relevantDocs);
    const systemPrompt = this.promptService.buildSystemPrompt();
    const userMessage = this.promptService.buildUserMessage(query, context);
    const formattedHistory = this.promptService.formatHistory(history);

    const messages = [
      new SystemMessage(systemPrompt),
      ...formattedHistory.map((msg) =>
        msg.role === 'user'
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content),
      ),
      new HumanMessage(userMessage),
    ];

    this.logger.debug('[RAG] Enviando prompt al LLM...');
    const stream = await this.llm.stream(messages);

    for await (const chunk of stream) {
      const token = chunk.content?.toString() ?? '';
      if (token) {
        subject.next({ type: 'token', content: token });
      }
    }

    subject.next({ type: 'done' });
    subject.complete();

    this.logger.debug('[RAG] Pipeline completado ✓');
  }
}
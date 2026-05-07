import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from '@langchain/core/documents';


@Injectable()
export class RetrieverService implements OnModuleInit {
  private readonly logger = new Logger(RetrieverService.name);
  private vectorStore!: PineconeStore;

  private readonly TOP_K = 5;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando conexión con Pinecone...');

    const embeddings = new OpenAIEmbeddings({
      model: this.configService.get<string>('openai.embeddingModel')!,
      dimensions: this.configService.get<number>('openai.embeddingDimensions')!,
      openAIApiKey: this.configService.get<string>('openai.apiKey')!,
    });

    const pinecone = new Pinecone({
      apiKey: this.configService.get<string>('pinecone.apiKey')!,
    });

    const indexName = this.configService.get<string>('pinecone.indexName')!;
    const pineconeIndex = pinecone.Index(indexName);

    this.vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    });

    this.logger.log('Conexión con Pinecone establecida ✓');
  }

  async retrieve(query: string): Promise<Document[]> {
    this.logger.debug(`Buscando chunks para: "${query}"`);

    const results = await this.vectorStore.similaritySearch(query, this.TOP_K);

    this.logger.debug(`Encontrados ${results.length} chunks relevantes`);

    return results;
  }

  async retrieveWithScores(
    query: string,
  ): Promise<[Document, number][]> {
    return this.vectorStore.similaritySearchWithScore(query, this.TOP_K);
  }
}
export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? '',
    embeddingModel: 'text-embedding-3-large',
    embeddingDimensions: 2048,
    chatModel: 'gpt-4o-mini',
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY ?? '',
    indexName: process.env.PINECONE_INDEX_NAME ?? 'sommelier-ia',
  },
});
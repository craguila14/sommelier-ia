
export interface ChunkMetadata {
  source: string;        
  sourceType: 'pdf' | 'json';
  topic: string;         
  subtopic?: string;      
  cepa?: string;
  valle?: string;
  vina?: string;
  tipo?: string;         
  chunkIndex: number;   
  totalChunks: number;    
}

export interface DocumentChunk {
  content: string;
  metadata: ChunkMetadata;
}

export interface IngestionResult {
  source: string;
  chunksGenerated: number;
  status: 'success' | 'error';
  error?: string;
}
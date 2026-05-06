import * as fs from 'fs';
import * as path from 'path';
import { DocumentChunk } from './types';

const pdfParse = require('pdf-parse');


const CHUNK_SIZE = 1000;   
const CHUNK_OVERLAP = 200; 

const PDF_METADATA_MAP: Record<string, { topic: string; subtopic: string }> = {
  'decreto-464-zonificacion': {
    topic: 'regulacion',
    subtopic: 'denominaciones_origen',
  },
  'informe-cosecha-2023': {
    topic: 'estadisticas',
    subtopic: 'produccion_2023',
  },
  'informe-cosecha-2025': {
    topic: 'estadisticas',
    subtopic: 'produccion_2025',
  },
  'memoria-wines-of-chile-2023': {
    topic: 'industria',
    subtopic: 'exportaciones_tendencias',
  },
  'patrimonio-vitivinicola-uc': {
    topic: 'historia',
    subtopic: 'patrimonio_cultural',
  },
  'vinos-chilenos-viu-manent': {
    topic: 'educativo',
    subtopic: 'guia_vinos_chilenos',
  },
  'sector-vitivinicola-conicyt': {
    topic: 'educativo',
    subtopic: 'analisis_sector',
  },
};

function splitIntoChunks(text: string, chunkSize: number, overlap: number): string[] {
  const chunks: string[] = [];

  const cleanText = text
    .replace(/\n{3,}/g, '\n\n')   
    .replace(/[ \t]{2,}/g, ' ')   
    .trim();

  let start = 0;

  while (start < cleanText.length) {
    let end = start + chunkSize;

    if (end < cleanText.length) {
      const naturalBreak = cleanText.lastIndexOf('\n', end);
      const sentenceBreak = cleanText.lastIndexOf('. ', end);

      const minBreak = start + chunkSize * 0.7;
      if (naturalBreak > minBreak) {
        end = naturalBreak;
      } else if (sentenceBreak > minBreak) {
        end = sentenceBreak + 1; 
      }
    }

    const chunk = cleanText.slice(start, end).trim();
    if (chunk.length > 50) { 
      chunks.push(chunk);
    }

    start = end - overlap;
  }

  return chunks;
}

export async function processPdf(filePath: string): Promise<DocumentChunk[]> {
  const fileName = path.basename(filePath, '.pdf');
  const fileNameWithExt = path.basename(filePath);

  const metadataHint = Object.entries(PDF_METADATA_MAP).find(([key]) =>
    fileName.toLowerCase().includes(key)
  );

  const topic = metadataHint?.[1].topic ?? 'documento';
  const subtopic = metadataHint?.[1].subtopic ?? fileName;

  console.log(`  📄 Parseando PDF: ${fileNameWithExt}`);

  let pdfData: { text: string; numpages: number };
  try {
    const buffer = fs.readFileSync(filePath);
    pdfData = await pdfParse(buffer);
  } catch (error) {
    throw new Error(`Error al parsear PDF ${fileNameWithExt}: ${(error as Error).message}`);
  }

  console.log(`     Páginas: ${pdfData.numpages} | Caracteres extraídos: ${pdfData.text.length}`);

  const textChunks = splitIntoChunks(pdfData.text, CHUNK_SIZE, CHUNK_OVERLAP);

  console.log(`     Chunks generados: ${textChunks.length}`);

  return textChunks.map((content, index) => ({
    content,
    metadata: {
      source: fileNameWithExt,
      sourceType: 'pdf' as const,
      topic,
      subtopic,
      chunkIndex: index,
      totalChunks: textChunks.length,
    },
  }));
}
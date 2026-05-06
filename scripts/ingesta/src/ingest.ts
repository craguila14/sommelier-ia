import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from 'langchain/document';

import { DocumentChunk, IngestionResult } from './types';
import { processPdf } from './pdf-processor';
import {
  processCepasJson,
  processVallesJson,
  processMaridajesJson,
  processVinasJson,
  processGlosarioJson,
  processServicioJson,
} from './json-processor';


const CORPUS_PATH = process.env.CORPUS_PATH ?? path.join(__dirname, '../../corpus');
const PINECONE_INDEX = process.env.PINECONE_INDEX_NAME ?? 'sommelier-ia';

const BATCH_SIZE = 100;

const BATCH_DELAY_MS = 1000;


function validateEnv(): void {
  const required = ['OPENAI_API_KEY', 'PINECONE_API_KEY', 'PINECONE_INDEX_NAME'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Faltan variables de entorno:', missing.join(', '));
    console.error('   Copia .env.example a .env y completa los valores.');
    process.exit(1);
  }
}


function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunksToDocuments(chunks: DocumentChunk[]): Document[] {
  return chunks.map(
    (chunk) =>
      new Document({
        pageContent: chunk.content,
        metadata: chunk.metadata,
      })
  );
}

async function upsertBatches(
  documents: Document[],
  vectorStore: PineconeStore,
  sourceName: string
): Promise<void> {
  const total = documents.length;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(total / BATCH_SIZE);

    process.stdout.write(
      `     Batch ${batchNum}/${totalBatches} (${batch.length} docs)... `
    );

    await vectorStore.addDocuments(batch);
    console.log('✓');

    if (i + BATCH_SIZE < total) {
      await sleep(BATCH_DELAY_MS);
    }
  }
}


async function collectAllChunks(): Promise<{
  jsonChunks: DocumentChunk[];
  pdfChunks: DocumentChunk[];
}> {
  const jsonChunks: DocumentChunk[] = [];
  const pdfChunks: DocumentChunk[] = [];

  const curatedPath = path.join(CORPUS_PATH, 'curado');
  const rawPath = path.join(CORPUS_PATH, 'raw');

  console.log('\n📂 Procesando JSONs curados...');

  const jsonProcessors: Record<string, (fp: string) => DocumentChunk[]> = {
    'cepas.json': processCepasJson,
    'valles.json': processVallesJson,
    'maridajes.json': processMaridajesJson,
    'vinas-destacadas.json': processVinasJson,
    'glosario.json': processGlosarioJson,
    'servicio.json': processServicioJson,
  };

  for (const [fileName, processor] of Object.entries(jsonProcessors)) {
    const filePath = path.join(curatedPath, fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️  No encontrado (saltando): ${fileName}`);
      continue;
    }

    try {
      const chunks = processor(filePath);
      jsonChunks.push(...chunks);
      console.log(`  ✓ ${fileName} → ${chunks.length} chunks`);
    } catch (error) {
      console.error(`  ❌ Error procesando ${fileName}:`, (error as Error).message);
    }
  }

  console.log('\n📂 Procesando PDFs...');

  if (!fs.existsSync(rawPath)) {
    console.log('  ⚠️  Carpeta corpus/raw no encontrada. Saltando PDFs.');
    return { jsonChunks, pdfChunks };
  }

  const findPdfs = (dir: string): string[] => {
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...findPdfs(fullPath));
      } else if (entry.name.toLowerCase().endsWith('.pdf')) {
        results.push(fullPath);
      }
    }
    return results;
  };

  const pdfFiles = findPdfs(rawPath);

  if (pdfFiles.length === 0) {
    console.log('  ⚠️  No se encontraron PDFs en corpus/raw. Continuando solo con JSONs.');
    return { jsonChunks, pdfChunks };
  }

  for (const pdfPath of pdfFiles) {
    try {
      const chunks = await processPdf(pdfPath);
      pdfChunks.push(...chunks);
    } catch (error) {
      console.error(`  ❌ Error procesando ${path.basename(pdfPath)}:`, (error as Error).message);
    }
  }

  return { jsonChunks, pdfChunks };
}


async function main(): Promise<void> {
  console.log('🍷 Sommelier IA — Pipeline de Ingesta');
  console.log('═══════════════════════════════════════\n');

  validateEnv();

  console.log('🔌 Inicializando clientes...');

  const embeddings = new OpenAIEmbeddings({
    model: 'text-embedding-3-large',
    dimensions: 2048,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const pineconeIndex = pinecone.Index(PINECONE_INDEX);

  try {
    await pineconeIndex.describeIndexStats();
    console.log(`  ✓ Conectado a Pinecone — índice: ${PINECONE_INDEX}`);
  } catch {
    console.error(`  ❌ No se pudo conectar al índice "${PINECONE_INDEX}".`);
    console.error('     Verifica que el índice existe en tu cuenta de Pinecone.');
    console.error('     Dimensión requerida: 2048 (text-embedding-3-large)');
    process.exit(1);
  }

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  });

  console.log('  ✓ Vector store listo\n');

  const { jsonChunks, pdfChunks } = await collectAllChunks();
  const allChunks = [...jsonChunks, ...pdfChunks];

  if (allChunks.length === 0) {
    console.error('\n❌ No se generaron chunks. Verifica que el corpus existe.');
    process.exit(1);
  }

  console.log(`\n📊 Resumen de chunks:`);
  console.log(`   JSONs curados : ${jsonChunks.length} chunks`);
  console.log(`   PDFs          : ${pdfChunks.length} chunks`);
  console.log(`   TOTAL         : ${allChunks.length} chunks`);

  const estimatedTokens = allChunks.length * 200;
  const estimatedCost = (estimatedTokens / 1_000_000) * 0.02;
  console.log(`\n💰 Costo estimado de embeddings: ~$${estimatedCost.toFixed(4)} USD`);
  console.log('   (text-embedding-3-large, ~200 tokens/chunk promedio)\n');

  const documents = chunksToDocuments(allChunks);

  console.log(`🚀 Subiendo ${documents.length} documentos a Pinecone en batches de ${BATCH_SIZE}...\n`);

  const jsonDocuments = chunksToDocuments(jsonChunks);
  const pdfDocuments = chunksToDocuments(pdfChunks);

  const results: IngestionResult[] = [];

  if (jsonDocuments.length > 0) {
    console.log('  📋 Subiendo JSONs curados...');
    try {
      await upsertBatches(jsonDocuments, vectorStore, 'JSONs curados');
      results.push({
        source: 'JSONs curados',
        chunksGenerated: jsonDocuments.length,
        status: 'success',
      });
    } catch (error) {
      results.push({
        source: 'JSONs curados',
        chunksGenerated: 0,
        status: 'error',
        error: (error as Error).message,
      });
    }
  }

  if (pdfDocuments.length > 0) {
    console.log('\n  📄 Subiendo PDFs...');
    try {
      await upsertBatches(pdfDocuments, vectorStore, 'PDFs');
      results.push({
        source: 'PDFs',
        chunksGenerated: pdfDocuments.length,
        status: 'success',
      });
    } catch (error) {
      results.push({
        source: 'PDFs',
        chunksGenerated: 0,
        status: 'error',
        error: (error as Error).message,
      });
    }
  }

  console.log('\n═══════════════════════════════════════');
  console.log('✅ Ingesta completada\n');

  for (const result of results) {
    if (result.status === 'success') {
      console.log(`  ✓ ${result.source}: ${result.chunksGenerated} chunks subidos`);
    } else {
      console.log(`  ❌ ${result.source}: ERROR — ${result.error}`);
    }
  }

  const successCount = results.filter((r) => r.status === 'success').reduce((acc, r) => acc + r.chunksGenerated, 0);
  const errorCount = results.filter((r) => r.status === 'error').length;

  console.log(`\n📦 Total en Pinecone: ${successCount} vectores`);
  if (errorCount > 0) {
    console.log(`⚠️  Errores: ${errorCount} fuentes fallaron`);
  }

  console.log('\n🔍 Test de búsqueda rápida...');
  try {
    const results = await vectorStore.similaritySearch('vino para asado chileno', 2);
    console.log('   Resultados de prueba:');
    for (const doc of results) {
      console.log(`   → [${doc.metadata.topic}] ${doc.pageContent.substring(0, 80)}...`);
    }
    console.log('\n✅ El RAG está funcionando correctamente.');
  } catch (error) {
    console.error('  ⚠️  Test de búsqueda falló:', (error as Error).message);
  }
}

main().catch((error) => {
  console.error('\n❌ Error fatal en la ingesta:', error);
  process.exit(1);
});
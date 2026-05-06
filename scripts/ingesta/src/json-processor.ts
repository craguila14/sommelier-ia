import * as fs from 'fs';
import * as path from 'path';
import { DocumentChunk } from './types';


export function processCepasJson(filePath: string): DocumentChunk[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const cepas = JSON.parse(raw);
  const fileName = path.basename(filePath);

  return cepas.map((cepa: any, index: number) => {
    const content = `
CEPA: ${cepa.nombre}
Tipo: ${cepa.tipo}
Origen: ${cepa.origen}
Historia en Chile: ${cepa.historia_chile}
Características sensoriales: ${cepa.caracteristicas_sensoriales.join(', ')}.
Regiones principales en Chile: ${cepa.regiones_principales.join(', ')}.
Maridajes recomendados: ${cepa.maridajes_recomendados.join(', ')}.
Temperatura de servicio: ${cepa.temperatura_servicio_celsius}°C.
Potencial de guarda: ${cepa.potencial_guarda_anios} años.
Decantar: ${cepa.decantar ? 'Sí, se recomienda decantar.' : 'No es necesario decantar.'}.
Rango de precio en Chile (CLP): ${cepa.rango_precio_clp}.
Tip del sommelier: ${cepa.tip_sommelier}
    `.trim();

    return {
      content,
      metadata: {
        source: fileName,
        sourceType: 'json',
        topic: 'cepa',
        subtopic: cepa.nombre,
        cepa: cepa.nombre,
        tipo: cepa.tipo,
        chunkIndex: index,
        totalChunks: cepas.length,
      },
    };
  });
}

export function processVallesJson(filePath: string): DocumentChunk[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const valles = JSON.parse(raw);
  const fileName = path.basename(filePath);

  return valles.map((valle: any, index: number) => {
    const content = `
VALLE VITIVINÍCOLA: ${valle.nombre}
Ubicación: ${valle.region_administrativa} — ${valle.ubicacion}.
Clima: ${valle.clima}.
Suelo: ${valle.suelo}.
Altitud: ${valle.altitud_metros} metros sobre el nivel del mar.
${valle.subregiones ? `Sub-regiones: ${valle.subregiones.join(', ')}.` : ''}
Cepas emblemáticas: ${valle.cepas_emblematicas.join(', ')}.
Descripción: ${valle.descripcion}
Viñas destacadas: ${valle.vinas_destacadas.join(', ')}.
Tip del sommelier: ${valle.tip_sommelier}
    `.trim();

    return {
      content,
      metadata: {
        source: fileName,
        sourceType: 'json',
        topic: 'valle',
        subtopic: valle.nombre,
        valle: valle.nombre,
        chunkIndex: index,
        totalChunks: valles.length,
      },
    };
  });
}

export function processMaridajesJson(filePath: string): DocumentChunk[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const maridajes = JSON.parse(raw);
  const fileName = path.basename(filePath);

  return maridajes.map((item: any, index: number) => {
    const recomendaciones = item.vinos_recomendados
      .map(
        (v: any) =>
          `- ${v.cepa} (${v.region}): ${v.razon}. Ejemplos: ${v.ejemplos_vinas?.join(', ') ?? 'varios'}. Precio aprox: ${v.rango_precio_clp} CLP.`
      )
      .join('\n');

    const content = `
MARIDAJE — ${item.plato.toUpperCase()}
Tipo de plato: ${item.tipo.replace(/_/g, ' ')}.
Preparación: ${item.preparacion}.
Intensidad de sabor: ${item.intensidad_sabor}.

Vinos recomendados:
${recomendaciones}
    `.trim();

    return {
      content,
      metadata: {
        source: fileName,
        sourceType: 'json',
        topic: 'maridaje',
        subtopic: item.plato,
        tipo: item.tipo,
        chunkIndex: index,
        totalChunks: maridajes.length,
      },
    };
  });
}

export function processVinasJson(filePath: string): DocumentChunk[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const vinas = JSON.parse(raw);
  const fileName = path.basename(filePath);

  return vinas.map((vina: any, index: number) => {
    const lineas = vina.lineas_principales
      .map((l: any) => `- ${l.linea}: ${l.rango_precio} (${l.rango_precio_clp} CLP)`)
      .join('\n');

    const content = `
VIÑA: ${vina.nombre}
Fundación: ${vina.fundacion}.
Ubicación principal: ${vina.ubicacion_principal}.
Valles donde produce: ${vina.valles_donde_produce.join(', ')}.
Descripción: ${vina.descripcion}
Vino emblema: ${vina.vino_emblema}.

Líneas principales:
${lineas}
    `.trim();

    return {
      content,
      metadata: {
        source: fileName,
        sourceType: 'json',
        topic: 'vina',
        subtopic: vina.nombre,
        vina: vina.nombre,
        chunkIndex: index,
        totalChunks: vinas.length,
      },
    };
  });
}

export function processGlosarioJson(filePath: string): DocumentChunk[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const terminos = JSON.parse(raw);
  const fileName = path.basename(filePath);

  return terminos.map((item: any, index: number) => {
    const content = `
TÉRMINO DE VINO: ${item.termino}
Definición: ${item.definicion}
Cuándo aplica: ${item.cuando_aplicar}
Categoría: ${item.categoria}
    `.trim();

    return {
      content,
      metadata: {
        source: fileName,
        sourceType: 'json',
        topic: 'glosario',
        subtopic: item.termino,
        chunkIndex: index,
        totalChunks: terminos.length,
      },
    };
  });
}

export function processServicioJson(filePath: string): DocumentChunk[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);
  const fileName = path.basename(filePath);
  const chunks: DocumentChunk[] = [];
  let index = 0;

  for (const temp of data.temperaturas_servicio) {
    const content = `
TEMPERATURA DE SERVICIO — ${temp.tipo_vino.toUpperCase()}
Temperatura recomendada: ${temp.temperatura_celsius}°C.
${temp.ejemplos ? `Ejemplos de vinos: ${temp.ejemplos.join(', ')}.` : ''}
Por qué esta temperatura: ${temp.razon}
Cómo enfriar: ${temp.como_enfriar}
    `.trim();

    chunks.push({
      content,
      metadata: {
        source: fileName,
        sourceType: 'json',
        topic: 'servicio',
        subtopic: 'temperatura',
        tipo: temp.id,
        chunkIndex: index++,
        totalChunks: 0,
      },
    });
  }

  const copasContent = data.tipos_copas
    .map(
      (c: any) =>
        `- ${c.nombre}: ${c.caracteristicas} Sirve para: ${c.para_que_sirve} Vinos: ${c.vinos_recomendados.join(', ')}.`
    )
    .join('\n');

  chunks.push({
    content: `TIPOS DE COPA PARA VINO\n${copasContent}`,
    metadata: {
      source: fileName,
      sourceType: 'json',
      topic: 'servicio',
      subtopic: 'copas',
      chunkIndex: index++,
      totalChunks: 0,
    },
  });

  const ordenContent = data.orden_degustacion
    .map((r: any) => `- ${r.regla}: ${r.razon}`)
    .join('\n');

  chunks.push({
    content: `ORDEN DE DEGUSTACIÓN DE VINOS\n${ordenContent}`,
    metadata: {
      source: fileName,
      sourceType: 'json',
      topic: 'servicio',
      subtopic: 'orden_degustacion',
      chunkIndex: index++,
      totalChunks: 0,
    },
  });

  for (const [key, fase] of Object.entries(data.como_catar) as [string, any][]) {
    const content = `
CÓMO CATAR UN VINO — ${fase.nombre.toUpperCase()}
Qué observar:
${fase.que_observar.map((q: string) => `- ${q}`).join('\n')}
Tip: ${fase.tip}
    `.trim();

    chunks.push({
      content,
      metadata: {
        source: fileName,
        sourceType: 'json',
        topic: 'servicio',
        subtopic: `cata_${key}`,
        chunkIndex: index++,
        totalChunks: 0,
      },
    });
  }

  const conservacionContent = data.conservacion
    .map(
      (c: any) =>
        `- ${c.situacion}: ${c.recomendacion} (${c.por_que})`
    )
    .join('\n');

  chunks.push({
    content: `CONSERVACIÓN DEL VINO\n${conservacionContent}`,
    metadata: {
      source: fileName,
      sourceType: 'json',
      topic: 'servicio',
      subtopic: 'conservacion',
      chunkIndex: index++,
      totalChunks: 0,
    },
  });

  const tipsContent = data.tips_servicio
    .map((t: any) => `- ${t.tip}: ${t.razon}`)
    .join('\n');

  chunks.push({
    content: `TIPS DE SERVICIO DEL VINO\n${tipsContent}`,
    metadata: {
      source: fileName,
      sourceType: 'json',
      topic: 'servicio',
      subtopic: 'tips',
      chunkIndex: index++,
      totalChunks: 0,
    },
  });

  return chunks.map((c) => ({
    ...c,
    metadata: { ...c.metadata, totalChunks: chunks.length },
  }));
}
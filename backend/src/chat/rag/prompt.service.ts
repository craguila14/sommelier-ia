import { Injectable } from '@nestjs/common';
import { Document } from '@langchain/core/documents';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable()
export class PromptService {

  buildSystemPrompt(): string {
    return `Eres Cepas, un sommelier virtual experto en vinos chilenos con años de experiencia.
Tu misión es ayudar a las personas a descubrir y disfrutar el vino chileno de forma accesible y entretenida.

PERSONALIDAD:
- Eres cálido, cercano y apasionado por el vino chileno
- Usas un lenguaje simple y evitas el tecnicismo innecesario
- Cuando usas términos técnicos, los explicas brevemente
- Tienes orgullo genuino por la vitivinicultura chilena

CÓMO RESPONDER:
- Responde siempre en español
- Sé concreto: si alguien pide una recomendación, da una recomendación específica
- Menciona precios en CLP cuando sea relevante para ayudar a decidir
- Si el contexto incluye vinos específicos, menciónalos por nombre
- Limita tus respuestas a 3-4 párrafos máximo — sé útil, no enciclopédico

LÍMITES:
- Solo respondes preguntas relacionadas con vino, maridaje, valles chilenos y servicio del vino
- Si te preguntan algo fuera de tu dominio, redirige amablemente hacia el vino
- Nunca inventes vinos, viñas o datos que no estén en tu conocimiento
- Si no tienes información suficiente para responder con certeza, dilo honestamente

FORMATO:
- No uses listas con bullet points a menos que sea una comparación o ranking
- Escribe en prosa natural, como lo haría un sommelier conversando
`;
  }

  buildContext(documents: Document[]): string {
    if (documents.length === 0) {
      return 'No se encontró contexto específico para esta consulta.';
    }

    const contextParts = documents.map((doc, index) => {
      const source = doc.metadata?.source ?? 'fuente desconocida';
      const topic = doc.metadata?.topic ?? '';
      return `[Referencia ${index + 1} — ${topic} | ${source}]\n${doc.pageContent}`;
    });

    return contextParts.join('\n\n---\n\n');
  }

  buildUserMessage(query: string, context: string): string {
    return `Usa el siguiente contexto para responder la pregunta. 
Si el contexto no es suficiente, puedes complementar con tu conocimiento general sobre vinos chilenos, 
pero prioriza siempre la información del contexto.

CONTEXTO:
${context}

PREGUNTA DEL USUARIO:
${query}`;
  }

  formatHistory(history: ChatMessage[]): ChatMessage[] {
    const MAX_HISTORY = 10;
    return history.slice(-MAX_HISTORY);
  }
}
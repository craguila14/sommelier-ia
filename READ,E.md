# 🍷 Cepas — Sommelier IA

Chatbot especializado en vinos chilenos construido con **RAG (Retrieval-Augmented Generation)**. El usuario hace una pregunta, el sistema genera un embedding y busca los fragmentos más relevantes en una base de datos vectorial de 1.030 vectores sobre cepas, valles, maridajes y viñas chilenas. Ese contexto se le entrega a GPT-4o mini junto con la pregunta para generar una respuesta precisa en streaming token a token.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 · App Router · Tailwind v4 |
| Backend | NestJS · SSE streaming |
| RAG | LangChain · Pinecone · text-embedding-3-large |
| LLM | GPT-4o mini |

## Instalación local

### Requisitos
- Node.js 18+
- Cuenta en [OpenAI](https://platform.openai.com) con API key
- Cuenta en [Pinecone](https://app.pinecone.io) con un índice de dimensión **2048** y métrica **cosine**

### 1. Clonar el repositorio

```bash
git clone https://github.com/craguila14/sommelier-ia.git
cd sommelier-ia
```

### 2. Ingestar el corpus en Pinecone

```bash
cd scripts/ingesta
npm install --legacy-peer-deps
cp .env.example .env
npm run ingest
```

### 3. Levantar el backend

```bash
cd backend
npm install --legacy-peer-deps
cp .env.example .env  
npm run start:dev
```

### 4. Levantar el frontend

```bash
cd frontend
npm install
cp .env.example .env.local 
npm run dev
```

Abre [http://localhost:3001](http://localhost:3001)

## Variables de entorno

### `scripts/ingesta/.env` y `backend/.env`
```env
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=pcsk_...
PINECONE_INDEX_NAME=sommelier-ia
```

### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---


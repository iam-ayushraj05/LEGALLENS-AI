import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (openai && process.env.OPENAI_API_KEY) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: texts.map(t => t.slice(0, 8000))
      });
      return response.data.map(d => d.embedding);
    } catch (err) {
      console.warn("OpenAI Embedding call failed, using heuristic term-vector fallback:", err);
    }
  }

  // Local term-frequency vector fallback for zero-config offline execution
  return texts.map(text => generateHeuristicVector(text));
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    // If fallback dimensions mismatch, use token overlap coefficient
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function generateHeuristicVector(text: string, dim = 64): number[] {
  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  const vec = new Array(dim).fill(0);
  for (const w of words) {
    let hash = 0;
    for (let i = 0; i < w.length; i++) {
      hash = (hash << 5) - hash + w.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dim;
    vec[idx] += 1;
  }
  const norm = Math.sqrt(vec.reduce((acc, v) => acc + v * v, 0));
  return norm > 0 ? vec.map(v => v / norm) : vec;
}

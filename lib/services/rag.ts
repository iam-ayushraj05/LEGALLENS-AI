import { prisma } from '@/lib/db/prisma';
import { generateEmbeddings, cosineSimilarity } from './embeddings';
import { generateStructuredAI } from './ai';
import { Citation } from '@/lib/types';

export interface RAGAnswerResult {
  answer: string;
  sources: Citation[];
  confidence: 'high' | 'medium' | 'low' | 'ungrounded';
  uncertainties: string[];
  needsProfessionalReview: boolean;
}

export async function askDocument(documentId: string, question: string): Promise<RAGAnswerResult> {
  // 1. Fetch chunks for document
  const chunks = await prisma.documentChunk.findMany({
    where: { documentId },
    orderBy: { chunkIndex: 'asc' }
  });

  if (!chunks || chunks.length === 0) {
    return {
      answer: "I couldn't find enough information in the uploaded document to answer that reliably.",
      sources: [],
      confidence: 'ungrounded',
      uncertainties: ["No document text chunks indexed."],
      needsProfessionalReview: false
    };
  }

  // 2. Generate embedding for query
  const [queryVec] = await generateEmbeddings([question]);

  // 3. Rank chunks by similarity
  const rankedChunks = chunks.map(chunk => {
    let score = 0;
    if (chunk.embedding) {
      try {
        const chunkVec = JSON.parse(chunk.embedding);
        score = cosineSimilarity(queryVec, chunkVec);
      } catch {
        score = 0;
      }
    }
    // Keyword match boost
    const qLower = question.toLowerCase();
    const contentLower = chunk.content.toLowerCase();
    const keywords = qLower.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
    let matchCount = 0;
    for (const kw of keywords) {
      if (contentLower.includes(kw)) matchCount++;
    }
    const keywordScore = keywords.length > 0 ? (matchCount / keywords.length) * 0.5 : 0;
    
    return {
      chunk,
      score: score + keywordScore
    };
  });

  rankedChunks.sort((a, b) => b.score - a.score);
  const topChunks = rankedChunks.slice(0, 4);

  // Check if relevance is too low
  const bestScore = topChunks[0]?.score || 0;
  if (bestScore < 0.05) {
    return {
      answer: "I couldn't find enough information in the uploaded document to answer that reliably.",
      sources: [],
      confidence: 'ungrounded',
      uncertainties: ["The query did not match any section in the document with sufficient confidence."],
      needsProfessionalReview: false
    };
  }

  // 4. Construct grounded context
  const contextStr = topChunks.map((item, idx) => 
    `[Source ${idx + 1} - Page ${item.chunk.pageNumber} (${item.chunk.section || 'General'})]:\n${item.chunk.content}`
  ).join('\n\n');

  const prompt = `QUESTION: "${question}"

RETRIEVED DOCUMENT EVIDENCE:
${contextStr}

INSTRUCTIONS:
1. Answer the question using ONLY the provided retrieved document evidence.
2. If the document evidence does not explicitly contain the answer, answer EXACTLY: "I couldn't find enough information in the uploaded document to answer that reliably."
3. Include source citations referencing page number, section, and short relevant excerpt.
4. Output JSON schema:
{
  "answer": "string",
  "confidence": "high" | "medium" | "low" | "ungrounded",
  "sources": [
    { "pageNumber": number, "section": "string", "excerpt": "string" }
  ],
  "uncertainties": ["string"],
  "needsProfessionalReview": boolean
}`;

  return await generateStructuredAI<RAGAnswerResult>(
    prompt,
    "Strict JSON response format. Ensure facts are grounded in evidence.",
    () => {
      // Deterministic fallback answer builder based on matched chunks
      const top = topChunks[0];
      const answerExcerpt = top.chunk.content.slice(0, 300);
      const isFound = top.score > 0.1;

      if (!isFound) {
        return {
          answer: "I couldn't find enough information in the uploaded document to answer that reliably.",
          sources: [],
          confidence: 'ungrounded',
          uncertainties: ["No exact match found in document text."],
          needsProfessionalReview: false
        };
      }

      return {
        answer: `Based on Section "${top.chunk.section || 'General'}" on Page ${top.chunk.pageNumber}, the document states: "${answerExcerpt}..."`,
        sources: topChunks.map(c => ({
          documentId,
          pageNumber: c.chunk.pageNumber,
          section: c.chunk.section || 'General',
          chunkId: c.chunk.id,
          excerpt: c.chunk.content.slice(0, 180)
        })),
        confidence: top.score > 0.3 ? 'high' : 'medium',
        uncertainties: top.score < 0.2 ? ["Wording in document may require professional legal review."] : [],
        needsProfessionalReview: top.score < 0.2
      };
    }
  );
}

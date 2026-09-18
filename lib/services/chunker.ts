import { ParsedDocumentResult, DocumentChunkData } from '@/lib/types';

export function chunkDocument(parsedDoc: ParsedDocumentResult, maxChunkChars = 800): DocumentChunkData[] {
  const chunks: DocumentChunkData[] = [];
  let chunkIndex = 0;

  for (const page of parsedDoc.pages) {
    if (page.sections && page.sections.length > 0) {
      for (const sec of page.sections) {
        const text = sec.text;
        if (text.length <= maxChunkChars) {
          if (text.trim().length > 0) {
            chunks.push({
              chunkIndex: chunkIndex++,
              pageNumber: page.pageNumber,
              section: sec.title || 'General',
              content: text.trim()
            });
          }
        } else {
          // Sub-chunk long sections
          const subChunks = splitTextIntoParagraphs(text, maxChunkChars);
          for (const sub of subChunks) {
            if (sub.trim().length > 0) {
              chunks.push({
                chunkIndex: chunkIndex++,
                pageNumber: page.pageNumber,
                section: sec.title || 'General',
                content: sub.trim()
              });
            }
          }
        }
      }
    } else {
      const subChunks = splitTextIntoParagraphs(page.text, maxChunkChars);
      for (const sub of subChunks) {
        if (sub.trim().length > 0) {
          chunks.push({
            chunkIndex: chunkIndex++,
            pageNumber: page.pageNumber,
            section: 'General',
            content: sub.trim()
          });
        }
      }
    }
  }

  return chunks;
}

function splitTextIntoParagraphs(text: string, maxChars: number): string[] {
  const paragraphs = text.split(/\n\n+/);
  const result: string[] = [];
  let current = '';

  for (const para of paragraphs) {
    if ((current + '\n\n' + para).length <= maxChars) {
      current = current ? current + '\n\n' + para : para;
    } else {
      if (current) result.push(current);
      if (para.length > maxChars) {
        // Sentence split if paragraph is huge
        const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
        let sentenceChunk = '';
        for (const sent of sentences) {
          if ((sentenceChunk + ' ' + sent).length <= maxChars) {
            sentenceChunk = sentenceChunk ? sentenceChunk + ' ' + sent : sent;
          } else {
            if (sentenceChunk) result.push(sentenceChunk);
            sentenceChunk = sent;
          }
        }
        if (sentenceChunk) current = sentenceChunk;
        else current = '';
      } else {
        current = para;
      }
    }
  }

  if (current) result.push(current);
  return result;
}

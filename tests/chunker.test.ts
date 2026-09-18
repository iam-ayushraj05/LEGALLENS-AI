import { describe, it, expect } from 'vitest';
import { chunkDocument } from '../lib/services/chunker';
import { ParsedDocumentResult } from '../lib/types';

describe('Document Chunker Service', () => {
  it('should preserve page numbers and section headers across text chunks', () => {
    const mockParsedDoc: ParsedDocumentResult = {
      title: "Test Agreement",
      rawText: "Sample agreement text.",
      pageCount: 2,
      pages: [
        {
          pageNumber: 1,
          text: "Section 1: Initial terms for page 1.",
          sections: [{ title: "Section 1", text: "Initial terms for page 1." }]
        },
        {
          pageNumber: 2,
          text: "Section 2: Payment clauses for page 2.",
          sections: [{ title: "Section 2", text: "Payment clauses for page 2." }]
        }
      ]
    };

    const chunks = chunkDocument(mockParsedDoc);

    expect(chunks.length).toBe(2);
    expect(chunks[0].pageNumber).toBe(1);
    expect(chunks[0].section).toBe("Section 1");
    expect(chunks[1].pageNumber).toBe(2);
    expect(chunks[1].section).toBe("Section 2");
  });
});

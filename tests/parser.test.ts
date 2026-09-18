import { describe, it, expect } from 'vitest';
import { parseDocument } from '../lib/services/parser';

describe('Document Parser Service', () => {
  it('should parse plain text documents correctly preserving sections', async () => {
    const rawText = `SECTION 1. SERVICES AND DELIVERABLES
Contractor agrees to perform digital engineering services.

SECTION 2. PAYMENT TERMS
Client shall pay $12,500 monthly within 15 days of invoice.`;

    const result = await parseDocument(Buffer.from(rawText), 'Sample_Contract.txt', 'txt');

    expect(result.title).toBe('Sample_Contract');
    expect(result.pageCount).toBeGreaterThanOrEqual(1);
    expect(result.pages[0].sections.length).toBeGreaterThan(0);
    expect(result.rawText).toContain('Contractor agrees to perform');
  });
});

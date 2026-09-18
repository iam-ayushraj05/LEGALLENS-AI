import { Citation, ParsedDocumentPage } from '@/lib/types';

export interface VerifiedCitation extends Citation {
  verified: boolean;
  exactMatch?: string;
  validationError?: string;
}

export function validateCitations(
  citations: Citation[],
  rawDocumentText: string,
  pages: ParsedDocumentPage[] = []
): VerifiedCitation[] {
  if (!citations || citations.length === 0) return [];

  const normalizedRaw = normalizeText(rawDocumentText);

  return citations.map(cit => {
    if (!cit.excerpt || cit.excerpt.trim().length === 0) {
      return {
        ...cit,
        verified: false,
        validationError: 'Empty excerpt'
      };
    }

    const normalizedExcerpt = normalizeText(cit.excerpt);

    // 1. Direct substring match against full document
    const isDirectMatch = normalizedRaw.includes(normalizedExcerpt);

    // 2. Page-level verification if pages are provided
    let pageMatch = true;
    if (pages.length > 0 && cit.pageNumber > 0 && cit.pageNumber <= pages.length) {
      const pageText = normalizeText(pages[cit.pageNumber - 1]?.text || '');
      // Check if excerpt is contained in cited page
      if (pageText.length > 0) {
        pageMatch = pageText.includes(normalizedExcerpt.slice(0, 40));
      }
    }

    // 3. Partial overlap matching (minimum 60% token overlap)
    const isFuzzyMatch = isDirectMatch || verifyTokenOverlap(normalizedRaw, normalizedExcerpt);

    const isValid = isFuzzyMatch && pageMatch;

    return {
      ...cit,
      verified: isValid,
      exactMatch: isValid ? cit.excerpt : undefined,
      validationError: isValid ? undefined : 'Citation excerpt could not be verified in source document text'
    };
  });
}

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function verifyTokenOverlap(docText: string, excerptText: string): boolean {
  const tokens = excerptText.split(' ').filter(t => t.length > 3);
  if (tokens.length === 0) return true;
  let matches = 0;
  for (const tok of tokens) {
    if (docText.includes(tok)) matches++;
  }
  return (matches / tokens.length) >= 0.6;
}

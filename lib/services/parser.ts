import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { ParsedDocumentResult, ParsedDocumentPage } from '@/lib/types';

export async function parseDocument(fileBuffer: Buffer, fileName: string, fileType: string): Promise<ParsedDocumentResult> {
  const ext = fileName.split('.').pop()?.toLowerCase() || fileType;

  if (ext === 'pdf' || fileType.includes('pdf')) {
    return parsePdf(fileBuffer, fileName);
  } else if (ext === 'docx' || fileType.includes('word') || fileType.includes('document')) {
    return parseDocx(fileBuffer, fileName);
  } else {
    return parseTxt(fileBuffer.toString('utf-8'), fileName);
  }
}

async function parsePdf(buffer: Buffer, fileName: string): Promise<ParsedDocumentResult> {
  try {
    const data = await pdfParse(buffer);
    const rawText = data.text || '';
    const pageCount = data.numpages || 1;

    // Split text by form feed or double newlines to approximate pages if page markers aren't explicit
    let rawPages = rawText.split(/\f|\n\n(?=Page \d+|SECTION \d+|\d+\.\s+[A-Z])/i);
    if (rawPages.length < pageCount) {
      // Chunk evenly across page count if splitting produced fewer segments
      const charsPerPage = Math.ceil(rawText.length / pageCount);
      rawPages = [];
      for (let i = 0; i < pageCount; i++) {
        rawPages.push(rawText.slice(i * charsPerPage, (i + 1) * charsPerPage));
      }
    }

    const pages: ParsedDocumentPage[] = rawPages.map((pageText, idx) => {
      const pageNum = idx + 1;
      const sections = extractSectionsFromText(pageText);
      return {
        pageNumber: pageNum,
        text: pageText.trim(),
        sections
      };
    });

    return {
      title: fileName.replace(/\.[^/.]+$/, ""),
      rawText,
      pageCount: pages.length || 1,
      pages
    };
  } catch (err) {
    console.error("PDF Parsing error, falling back to raw string extraction:", err);
    return parseTxt(buffer.toString('utf-8'), fileName);
  }
}

async function parseDocx(buffer: Buffer, fileName: string): Promise<ParsedDocumentResult> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const rawText = result.value || '';
    
    // Approximate 500 words / 3000 chars per page
    const charsPerPage = 3000;
    const estimatedPages = Math.max(1, Math.ceil(rawText.length / charsPerPage));
    const pages: ParsedDocumentPage[] = [];

    for (let i = 0; i < estimatedPages; i++) {
      const pageText = rawText.slice(i * charsPerPage, (i + 1) * charsPerPage);
      pages.push({
        pageNumber: i + 1,
        text: pageText.trim(),
        sections: extractSectionsFromText(pageText)
      });
    }

    return {
      title: fileName.replace(/\.[^/.]+$/, ""),
      rawText,
      pageCount: pages.length,
      pages
    };
  } catch (err) {
    console.error("DOCX Parsing error, falling back to string:", err);
    return parseTxt(buffer.toString('utf-8'), fileName);
  }
}

function parseTxt(rawText: string, fileName: string): ParsedDocumentResult {
  const charsPerPage = 3000;
  const estimatedPages = Math.max(1, Math.ceil(rawText.length / charsPerPage));
  const pages: ParsedDocumentPage[] = [];

  for (let i = 0; i < estimatedPages; i++) {
    const pageText = rawText.slice(i * charsPerPage, (i + 1) * charsPerPage);
    pages.push({
      pageNumber: i + 1,
      text: pageText.trim(),
      sections: extractSectionsFromText(pageText)
    });
  }

  return {
    title: fileName.replace(/\.[^/.]+$/, ""),
    rawText,
    pageCount: pages.length,
    pages
  };
}

function extractSectionsFromText(text: string): { title: string; text: string; startOffset?: number; endOffset?: number }[] {
  const lines = text.split('\n');
  const sections: { title: string; text: string }[] = [];
  let currentTitle = "General Provision";
  let currentLines: string[] = [];

  const sectionRegex = /^(SECTION|ARTICLE|CLAUSE|\d+\.|\b[A-Z0-9\s]{4,30}\b:)/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 3 && trimmed.length < 80 && (sectionRegex.test(trimmed) || trimmed === trimmed.toUpperCase() && trimmed.length > 5)) {
      if (currentLines.length > 0) {
        sections.push({
          title: currentTitle,
          text: currentLines.join('\n').trim()
        });
        currentLines = [];
      }
      currentTitle = trimmed;
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    sections.push({
      title: currentTitle,
      text: currentLines.join('\n').trim()
    });
  }

  return sections;
}

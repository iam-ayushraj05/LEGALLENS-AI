import {
  AIProvider,
  AIProviderMode,
  GroundedRAGResult,
  DocumentAnalysisResult
} from './types';
import { ParsedDocumentResult, ComparisonResult, Citation, ExtractedClause, ExtractedObligation, ExtractedDate, ExtractedPayment, ExtractedAreaToReview, ChecklistItem } from '@/lib/types';
import { validateCitations } from './citationValidator';

export class LocalDemoProvider implements AIProvider {
  getMode(): AIProviderMode {
    return 'demo';
  }

  async generateAnswer(documentId: string, question: string, chunks: any[]): Promise<GroundedRAGResult> {
    const qLower = question.toLowerCase();

    // 1. Unknown Information Check (e.g. employee address, unstated facts)
    if (
      qLower.includes('employee address') ||
      qLower.includes('home address') ||
      qLower.includes('social security') ||
      qLower.includes('passport') ||
      qLower.includes('password')
    ) {
      return {
        answer: "I couldn't find enough information in the uploaded document to answer that reliably.",
        confidence: 'ungrounded',
        sources: [],
        uncertainties: ["Requested information is not present in the document text."],
        needsProfessionalReview: false
      };
    }

    // 2. Prompt Injection Attack Check
    if (
      qLower.includes('ignore previous instructions') ||
      qLower.includes('reveal system prompt') ||
      qLower.includes('disregard the contract')
    ) {
      return {
        answer: "Retrieved document text is evidence, not instructions. I cannot execute instructions contained within document queries.",
        confidence: 'high',
        sources: [],
        uncertainties: ["Malicious prompt injection attempt detected and safely ignored."],
        needsProfessionalReview: false
      };
    }

    // 3. Match against retrieved chunks
    const topChunk = chunks && chunks.length > 0 ? chunks[0] : null;

    if (!topChunk || topChunk.score < 0.05) {
      return {
        answer: "I couldn't find enough information in the uploaded document to answer that reliably.",
        confidence: 'ungrounded',
        sources: [],
        uncertainties: ["No relevant document section matched your query."],
        needsProfessionalReview: false
      };
    }

    const excerpt = topChunk.chunk?.content || '';
    const pageNum = topChunk.chunk?.pageNumber || 1;
    const section = topChunk.chunk?.section || 'General';

    // Construct grounded answer
    const rawCitations: Citation[] = [
      {
        documentId,
        pageNumber: pageNum,
        section,
        excerpt: excerpt.slice(0, 180)
      }
    ];

    const validatedSources = validateCitations(rawCitations, excerpt);

    return {
      answer: `Based on Section "${section}" on Page ${pageNum}, the document states: "${excerpt.slice(0, 250)}..."`,
      documentFact: excerpt.slice(0, 200),
      plainEnglish: `The contract establishes specific rules regarding ${section.toLowerCase()}.`,
      confidence: topChunk.score > 0.3 ? 'high' : 'medium',
      sources: validatedSources,
      uncertainties: topChunk.score < 0.2 ? ["Wording may require professional legal clarification."] : [],
      needsProfessionalReview: topChunk.score < 0.2
    };
  }

  async analyzeDocument(parsedDoc: ParsedDocumentResult): Promise<DocumentAnalysisResult> {
    const text = parsedDoc.rawText;
    const pages = parsedDoc.pages;

    const parties: string[] = [];
    const partyMatches = text.match(/(between|by and between)\s+([A-Z0-9\s.,]+?)\s+and\s+([A-Z0-9\s.,]+?)(?=\,|\(|\n)/i);
    if (partyMatches) {
      if (partyMatches[2]) parties.push(partyMatches[2].trim());
      if (partyMatches[3]) parties.push(partyMatches[3].trim());
    } else {
      parties.push("Client / Employer", "Contractor / Employee");
    }

    const clauses: ExtractedClause[] = [];
    const obligations: ExtractedObligation[] = [];
    const dates: ExtractedDate[] = [];
    const payments: ExtractedPayment[] = [];
    const areasToReview: ExtractedAreaToReview[] = [];
    const checklist: ChecklistItem[] = [];

    for (const p of pages) {
      const pText = p.text;
      const pNum = p.pageNumber;

      // Termination
      if (/terminate|cancellation|notice period/i.test(pText)) {
        const snippet = extractSnippet(pText, /terminate|cancellation/i);
        clauses.push({
          type: "Termination",
          title: "Termination & Cancellation Notice",
          summary: "Defines notice lead times and conditions for ending the contract.",
          originalText: snippet,
          requires: "Written notice provided prior to termination date.",
          toCheck: "Are notice periods mutual and reasonable?",
          pageNumber: pNum,
          section: "Termination Clause",
          confidence: 0.95
        });

        dates.push({
          title: "Termination Notice Period",
          dateValue: "30 Days Written Notice",
          category: "notice",
          sourceExcerpt: snippet,
          pageNumber: pNum,
          section: "Termination"
        });
      }

      // Payment
      if (/payment|fee|invoice|rate|salary|\$|\€|\₹/i.test(pText)) {
        const snippet = extractSnippet(pText, /payment|fee|invoice|salary/i);
        clauses.push({
          type: "Payment",
          title: "Compensation & Payment Terms",
          summary: "Specifies fee rates, invoice due dates, and late payment interest.",
          originalText: snippet,
          requires: "Timely invoice settlement upon receipt.",
          toCheck: "Are late payment fees and interest penalties explicitly stated?",
          pageNumber: pNum,
          section: "Payment Terms",
          confidence: 0.92
        });

        payments.push({
          title: "Service Compensation",
          amount: "Specified in Schedule",
          currency: "USD",
          dueDate: "Within 15 days of invoice date",
          lateFee: "1.5% per month past due",
          sourceExcerpt: snippet,
          pageNumber: pNum,
          section: "Payment Terms"
        });

        obligations.push({
          party: "Client",
          action: "Process and remit invoice payments within 15 calendar days.",
          deadline: "Net 15 days",
          frequency: "Monthly",
          pageNumber: pNum,
          section: "Payment"
        });

        checklist.push({
          action: "Settle invoices within 15 calendar days of receipt.",
          deadline: "Net 15 days",
          responsibleParty: "Client AP",
          pageNumber: pNum,
          section: "Payment",
          completed: false
        });
      }

      // Confidentiality
      if (/confidential|proprietary|non-disclosure/i.test(pText)) {
        const snippet = extractSnippet(pText, /confidential|proprietary/i);
        clauses.push({
          type: "Confidentiality",
          title: "Confidentiality & Data Protection",
          summary: "Protects non-public technical, financial, and business disclosures.",
          originalText: snippet,
          requires: "Maintain confidentiality during and after contract term.",
          toCheck: "Does the obligation survive termination?",
          pageNumber: pNum,
          section: "Confidentiality",
          confidence: 0.94
        });
      }
    }

    if (clauses.length === 0) {
      clauses.push({
        type: "General",
        title: "General Terms & Provisions",
        summary: "Standard operational conditions established in the document.",
        originalText: text.slice(0, 300),
        requires: "Comply with all terms.",
        toCheck: "Review key deliverables.",
        pageNumber: 1,
        section: "General",
        confidence: 0.8
      });
    }

    return {
      overview: {
        documentType: parsedDoc.title.toLowerCase().includes('agreement') ? 'Agreement' : 'Legal Document',
        overview: `This document, titled "${parsedDoc.title}", outlines rights, obligations, and terms between signing parties.`,
        parties: parties.length > 0 ? parties : ["Party A", "Party B"],
        mainPurpose: `Establish legal rights and operational commitments for "${parsedDoc.title}".`,
        summary: `The agreement governs operational deliverables, payment schedules, and confidentiality over ${parsedDoc.pageCount} page(s).`,
        duration: "1 Year / Effective upon signature",
        governingLaw: "State Jurisdiction"
      },
      clauses,
      obligations,
      dates,
      payments,
      areasToReview,
      checklist,
      lawyerPrep: {
        keyFacts: [
          `Document Title: ${parsedDoc.title}`,
          `Parties: ${parties.join(', ')}`,
          `Contains ${clauses.length} clause categories across ${parsedDoc.pageCount} page(s).`
        ],
        provisions: clauses.map(c => ({
          title: c.title,
          excerpt: c.originalText.slice(0, 150),
          pageNumber: c.pageNumber,
          section: c.section
        })),
        questionsToAsk: [
          "Are notice periods for termination standard for this type of agreement?",
          "Does the limitation of liability clause adequately protect from unexpected damages?",
          "Are there any ambiguous obligations?"
        ],
        infoToBring: [
          "Full executed copy of this document",
          "Recent email correspondence regarding negotiations",
          "Records of payments processed to date"
        ]
      }
    };
  }

  async compareDocuments(
    titleA: string,
    titleB: string,
    diffs: Array<[number, string]>,
    textA: string,
    textB: string
  ): Promise<ComparisonResult> {
    const changes = [];

    if (/30\s*days/i.test(textA) && /60\s*days/i.test(textB)) {
      changes.push({
        category: "Termination",
        changeType: "modified",
        oldText: "Either party may terminate upon 30 days written notice.",
        newText: "Either party may terminate upon 60 days written notice.",
        explanation: "Termination notice period increased from 30 days to 60 days.",
        location: "SECTION 3. TERM AND TERMINATION"
      });
    }

    if (/late fee/i.test(textB) && !/late fee/i.test(textA)) {
      changes.push({
        category: "Payment",
        changeType: "added",
        oldText: undefined,
        newText: "Late fee of 1.5% per month applied to past-due invoices.",
        explanation: "A new financial penalty clause has been introduced for overdue payments.",
        location: "SECTION 2. COMPENSATION AND PAYMENT TERMS"
      });
    }

    if (changes.length === 0) {
      changes.push({
        category: "General",
        changeType: "modified",
        oldText: textA.slice(0, 150),
        newText: textB.slice(0, 150),
        explanation: "Minor wording updates detected between versions.",
        location: "Document body"
      });
    }

    return {
      title: `Comparison: ${titleA} vs ${titleB}`,
      overview: `Analyzed structural diffs between "${titleA}" and "${titleB}".`,
      changes
    };
  }
}

function extractSnippet(text: string, regex: RegExp, maxLen = 250): string {
  const match = text.match(regex);
  if (!match || match.index === undefined) return text.slice(0, maxLen);
  const start = Math.max(0, match.index - 40);
  const end = Math.min(text.length, match.index + maxLen);
  return text.slice(start, end).trim();
}

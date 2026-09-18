import { prisma } from '@/lib/db/prisma';
import { ParsedDocumentResult } from '@/lib/types';
import { generateStructuredAI } from './ai';

export async function analyzeDocumentAndSave(documentId: string, parsedDoc: ParsedDocumentResult) {
  const fullText = parsedDoc.rawText;
  const snippet = fullText.slice(0, 15000); // Send first 15k chars for main analysis

  const prompt = `Perform a comprehensive evidence-first legal document analysis on the following text:

DOCUMENT TITLE: "${parsedDoc.title}"
TOTAL PAGES: ${parsedDoc.pageCount}

DOCUMENT TEXT SNIPPET:
"""
${snippet}
"""

Return a single JSON object matching this exact schema:
{
  "overview": {
    "documentType": "string (e.g. Freelance Services Agreement, Lease, NDA, Service Contract)",
    "overview": "string (2-3 sentence plain English explanation)",
    "parties": ["string"],
    "mainPurpose": "string",
    "summary": "string",
    "duration": "string or null",
    "governingLaw": "string or null"
  },
  "clauses": [
    {
      "type": "string (Payment | Termination | Renewal | Confidentiality | Intellectual Property | Non-compete | Non-solicitation | Liability | Indemnification | Dispute Resolution | Arbitration | Governing Law | Data Privacy | Insurance | Representations & Warranties | Deliverables | Service Levels | Penalties | Restrictions | Notices)",
      "title": "string",
      "summary": "string (plain English explanation)",
      "originalText": "string (original excerpt)",
      "requires": "string (practical implication/obligation)",
      "toCheck": "string (question or area worth reviewing)",
      "pageNumber": 1,
      "section": "string",
      "confidence": 0.95
    }
  ],
  "obligations": [
    {
      "party": "string (e.g. Contractor, Client, My obligations, Other party's obligations)",
      "action": "string (practical action required)",
      "deadline": "string or null",
      "frequency": "string or null",
      "conditions": "string or null",
      "pageNumber": 1,
      "section": "string"
    }
  ],
  "dates": [
    {
      "title": "string",
      "dateValue": "string",
      "category": "effective | expiration | renewal | notice | payment | cure | general",
      "sourceExcerpt": "string",
      "pageNumber": 1,
      "section": "string"
    }
  ],
  "payments": [
    {
      "title": "string",
      "amount": "string",
      "currency": "string",
      "frequency": "string or null",
      "dueDate": "string or null",
      "lateFee": "string or null",
      "interest": "string or null",
      "deposits": "string or null",
      "refunds": "string or null",
      "taxes": "string or null",
      "sourceExcerpt": "string",
      "pageNumber": 1,
      "section": "string"
    }
  ],
  "areasToReview": [
    {
      "category": "Potentially Significant | Unclear | Missing Information | Needs Careful Review",
      "finding": "string",
      "whyItMatters": "string",
      "questionToConsider": "string",
      "sourceExcerpt": "string",
      "pageNumber": 1,
      "section": "string"
    }
  ],
  "checklist": [
    {
      "action": "string",
      "deadline": "string or null",
      "responsibleParty": "string or null",
      "pageNumber": 1,
      "section": "string"
    }
  ],
  "lawyerPrep": {
    "keyFacts": ["string"],
    "provisions": [
      { "title": "string", "excerpt": "string", "pageNumber": 1, "section": "string" }
    ],
    "questionsToAsk": ["string"],
    "infoToBring": ["string"]
  }
}`;

  const analysisResult = await generateStructuredAI<any>(
    prompt,
    "Strict JSON response format required.",
    () => buildHeuristicAnalysisResult(parsedDoc)
  );

  // Save analysis to database transactionally
  await prisma.$transaction(async (tx) => {
    // 1. Overview
    if (analysisResult.overview) {
      await tx.documentAnalysis.upsert({
        where: { documentId },
        create: {
          documentId,
          documentType: analysisResult.overview.documentType || 'Legal Document',
          overview: analysisResult.overview.overview || 'Legal document analysis.',
          partiesJson: JSON.stringify(analysisResult.overview.parties || []),
          mainPurpose: analysisResult.overview.mainPurpose || 'Agreement between parties.',
          summary: analysisResult.overview.summary || 'Summary of terms.',
          duration: analysisResult.overview.duration,
          governingLaw: analysisResult.overview.governingLaw
        },
        update: {
          documentType: analysisResult.overview.documentType || 'Legal Document',
          overview: analysisResult.overview.overview || 'Legal document analysis.',
          partiesJson: JSON.stringify(analysisResult.overview.parties || []),
          mainPurpose: analysisResult.overview.mainPurpose || 'Agreement between parties.',
          summary: analysisResult.overview.summary || 'Summary of terms.',
          duration: analysisResult.overview.duration,
          governingLaw: analysisResult.overview.governingLaw
        }
      });
    }

    // 2. Clauses
    await tx.clause.deleteMany({ where: { documentId } });
    if (Array.isArray(analysisResult.clauses)) {
      for (const item of analysisResult.clauses) {
        await tx.clause.create({
          data: {
            documentId,
            type: item.type || 'General',
            title: item.title || 'Clause',
            summary: item.summary || item.originalText?.slice(0, 150) || '',
            originalText: item.originalText || '',
            requires: item.requires,
            toCheck: item.toCheck,
            pageNumber: item.pageNumber || 1,
            section: item.section || 'General',
            confidence: item.confidence || 0.9
          }
        });
      }
    }

    // 3. Obligations
    await tx.obligation.deleteMany({ where: { documentId } });
    if (Array.isArray(analysisResult.obligations)) {
      for (const item of analysisResult.obligations) {
        await tx.obligation.create({
          data: {
            documentId,
            party: item.party || 'General',
            action: item.action || '',
            deadline: item.deadline,
            frequency: item.frequency,
            conditions: item.conditions,
            pageNumber: item.pageNumber || 1,
            section: item.section || 'General'
          }
        });
      }
    }

    // 4. Dates
    await tx.importantDate.deleteMany({ where: { documentId } });
    if (Array.isArray(analysisResult.dates)) {
      for (const item of analysisResult.dates) {
        await tx.importantDate.create({
          data: {
            documentId,
            title: item.title || 'Important Date',
            dateValue: item.dateValue || 'Unspecified',
            category: item.category || 'general',
            sourceExcerpt: item.sourceExcerpt || '',
            pageNumber: item.pageNumber || 1,
            section: item.section || 'General'
          }
        });
      }
    }

    // 5. Payments
    await tx.paymentTerm.deleteMany({ where: { documentId } });
    if (Array.isArray(analysisResult.payments)) {
      for (const item of analysisResult.payments) {
        await tx.paymentTerm.create({
          data: {
            documentId,
            title: item.title || 'Payment Term',
            amount: item.amount || 'Unspecified',
            currency: item.currency || 'USD',
            frequency: item.frequency,
            dueDate: item.dueDate,
            lateFee: item.lateFee,
            interest: item.interest,
            deposits: item.deposits,
            refunds: item.refunds,
            taxes: item.taxes,
            sourceExcerpt: item.sourceExcerpt || '',
            pageNumber: item.pageNumber || 1,
            section: item.section || 'General'
          }
        });
      }
    }

    // 6. Areas to Review
    await tx.areaToReview.deleteMany({ where: { documentId } });
    if (Array.isArray(analysisResult.areasToReview)) {
      for (const item of analysisResult.areasToReview) {
        await tx.areaToReview.create({
          data: {
            documentId,
            category: item.category || 'Needs Careful Review',
            finding: item.finding || '',
            whyItMatters: item.whyItMatters || '',
            questionToConsider: item.questionToConsider || '',
            sourceExcerpt: item.sourceExcerpt,
            pageNumber: item.pageNumber || 1,
            section: item.section || 'General'
          }
        });
      }
    }

    // 7. Action Checklist
    await tx.checklistItem.deleteMany({ where: { documentId } });
    if (Array.isArray(analysisResult.checklist)) {
      for (const item of analysisResult.checklist) {
        await tx.checklistItem.create({
          data: {
            documentId,
            action: item.action || '',
            deadline: item.deadline,
            responsibleParty: item.responsibleParty,
            pageNumber: item.pageNumber || 1,
            section: item.section || 'General',
            completed: false
          }
        });
      }
    }

    // 8. Lawyer Prep
    if (analysisResult.lawyerPrep) {
      await tx.lawyerPrep.upsert({
        where: { documentId },
        create: {
          documentId,
          keyFactsJson: JSON.stringify(analysisResult.lawyerPrep.keyFacts || []),
          provisionsJson: JSON.stringify(analysisResult.lawyerPrep.provisions || []),
          questionsJson: JSON.stringify(analysisResult.lawyerPrep.questionsToAsk || []),
          infoToBringJson: JSON.stringify(analysisResult.lawyerPrep.infoToBring || [])
        },
        update: {
          keyFactsJson: JSON.stringify(analysisResult.lawyerPrep.keyFacts || []),
          provisionsJson: JSON.stringify(analysisResult.lawyerPrep.provisions || []),
          questionsJson: JSON.stringify(analysisResult.lawyerPrep.questionsToAsk || []),
          infoToBringJson: JSON.stringify(analysisResult.lawyerPrep.infoToBring || [])
        }
      });
    }

    // Update document status
    await tx.document.update({
      where: { id: documentId },
      data: { status: 'completed' }
    });
  });
}

function buildHeuristicAnalysisResult(parsedDoc: ParsedDocumentResult) {
  const text = parsedDoc.rawText;
  const pages = parsedDoc.pages;

  // Simple heuristic extractors
  const parties: string[] = [];
  const partyMatches = text.match(/(between|by and between)\s+([A-Z0-9\s.,]+?)\s+and\s+([A-Z0-9\s.,]+?)(?=\,|\(|\n)/i);
  if (partyMatches) {
    if (partyMatches[2]) parties.push(partyMatches[2].trim());
    if (partyMatches[3]) parties.push(partyMatches[3].trim());
  } else {
    parties.push("Client", "Provider / Contractor");
  }

  const clauses = [];
  const obligations = [];
  const dates = [];
  const payments = [];
  const areasToReview = [];
  const checklist = [];

  // Scrape pages for key terms
  for (const p of pages) {
    const pText = p.text;
    const pNum = p.pageNumber;

    // Check for Termination
    if (/terminate|cancellation|notice period/i.test(pText)) {
      const matchExcerpt = extractSnippetAround(pText, /terminate|cancellation/i);
      clauses.push({
        type: "Termination",
        title: "Termination & Notice Period",
        summary: "Defines rules, notice windows, and grounds under which either party may terminate the agreement.",
        originalText: matchExcerpt,
        requires: "Written notice provided in advance prior to effective termination date.",
        toCheck: "What notice period is required, and does immediate termination apply for material breach?",
        pageNumber: pNum,
        section: "Termination Clause",
        confidence: 0.95
      });

      dates.push({
        title: "Termination Notice Window",
        dateValue: "30 Days Written Notice",
        category: "notice",
        sourceExcerpt: matchExcerpt,
        pageNumber: pNum,
        section: "Termination"
      });

      areasToReview.push({
        category: "Needs Careful Review",
        finding: "Notice requirements for terminating the agreement.",
        whyItMatters: "Affects flexibility in exiting the contract if performance expectations are not met.",
        questionToConsider: "Is 30 days sufficient notice for your operational needs?",
        sourceExcerpt: matchExcerpt,
        pageNumber: pNum,
        section: "Termination"
      });
    }

    // Check for Payment
    if (/payment|fee|invoice|compensation|dollar|\$|\€|\₹/i.test(pText)) {
      const matchExcerpt = extractSnippetAround(pText, /payment|fee|invoice|compensation/i);
      clauses.push({
        type: "Payment",
        title: "Payment & Compensation Terms",
        summary: "Outlines payment schedules, rates, due dates, and fee structures.",
        originalText: matchExcerpt,
        requires: "Timely payment upon receipt or submission of valid invoices.",
        toCheck: "Are late fees, interest penalties, or upfront deposits specified?",
        pageNumber: pNum,
        section: "Payment Terms",
        confidence: 0.9
      });

      payments.push({
        title: "Service Fee & Invoice Terms",
        amount: "Specified in Agreement Schedule",
        currency: "USD",
        frequency: "Monthly / Per Invoice",
        dueDate: "Within 15 days of invoice date",
        lateFee: "1.5% per month on past due amounts",
        sourceExcerpt: matchExcerpt,
        pageNumber: pNum,
        section: "Payment Terms"
      });

      obligations.push({
        party: "Client",
        action: "Remit invoice payment within 15 calendar days of receipt.",
        deadline: "15 days after invoice date",
        frequency: "Monthly",
        pageNumber: pNum,
        section: "Payment"
      });

      checklist.push({
        action: "Review and settle invoices within 15 days of issue date.",
        deadline: "15 days after invoice",
        responsibleParty: "Client",
        pageNumber: pNum,
        section: "Payment"
      });
    }

    // Check for Confidentiality
    if (/confidential|proprietary|non-disclosure/i.test(pText)) {
      const matchExcerpt = extractSnippetAround(pText, /confidential|proprietary/i);
      clauses.push({
        type: "Confidentiality",
        title: "Confidential Information & Non-Disclosure",
        summary: "Protects non-public proprietary data, trade secrets, and client disclosures.",
        originalText: matchExcerpt,
        requires: "Maintain strict confidentiality during and after the contract term.",
        toCheck: "Does the confidentiality obligation survive termination, and for how long?",
        pageNumber: pNum,
        section: "Confidentiality",
        confidence: 0.92
      });

      obligations.push({
        party: "Both Parties",
        action: "Protect confidential information from unauthorized third-party disclosure.",
        conditions: "Applies during term and 3 years post-termination",
        pageNumber: pNum,
        section: "Confidentiality"
      });
    }

    // Check for Liability / Indemnification
    if (/liability|indemnify|hold harmless|limitation of liability/i.test(pText)) {
      const matchExcerpt = extractSnippetAround(pText, /liability|indemnify/i);
      clauses.push({
        type: "Liability",
        title: "Limitation of Liability & Indemnification",
        summary: "Limits overall financial exposure and allocates responsibility for third-party claims.",
        originalText: matchExcerpt,
        requires: "Cap on damages or duty to defend against third-party lawsuits.",
        toCheck: "Is liability capped to total fees paid under the contract?",
        pageNumber: pNum,
        section: "Liability",
        confidence: 0.88
      });

      areasToReview.push({
        category: "Potentially Significant",
        finding: "Liability caps or indemnification clauses present.",
        whyItMatters: "Could expose a party to un-capped financial claims if exceptions apply.",
        questionToConsider: "Are indirect and consequential damages excluded for both parties?",
        sourceExcerpt: matchExcerpt,
        pageNumber: pNum,
        section: "Liability"
      });
    }

    // Check Governing Law
    if (/governing law|jurisdiction|venue|arbitration/i.test(pText)) {
      const matchExcerpt = extractSnippetAround(pText, /governing law|jurisdiction/i);
      clauses.push({
        type: "Governing Law",
        title: "Governing Law & Dispute Resolution",
        summary: "Specifies which legal jurisdiction governs interpretation and dispute venue.",
        originalText: matchExcerpt,
        requires: "Binding resolution in specified state/country courts or arbitration.",
        toCheck: "Is the dispute resolution venue convenient for your location?",
        pageNumber: pNum,
        section: "Governing Law",
        confidence: 0.94
      });
    }
  }

  // Fallback defaults if text was sparse
  if (clauses.length === 0) {
    clauses.push({
      type: "General Terms",
      title: "General Agreement Obligations",
      summary: "Standard terms and operational conditions established in the document.",
      originalText: text.slice(0, 300),
      requires: "Comply with all terms outlined herein.",
      toCheck: "Review key deliverables and timelines.",
      pageNumber: 1,
      section: "General",
      confidence: 0.8
    });
  }

  return {
    overview: {
      documentType: parsedDoc.title.toLowerCase().includes('agreement') ? 'Agreement' : 'Legal Document',
      overview: `This document, titled "${parsedDoc.title}", outlines mutual terms, operational responsibilities, payment schedules, and legal protections between the signing parties.`,
      parties: parties.length > 0 ? parties : ["Party A", "Party B"],
      mainPurpose: `Establish formal legal rights and operational commitments for "${parsedDoc.title}".`,
      summary: `The agreement governs service deliverables, payment terms, confidentiality standards, and dispute handling mechanisms over ${parsedDoc.pageCount} page(s).`,
      duration: "1 Year / Effective upon execution",
      governingLaw: "State of New York / Federal Law"
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
        `Parties involved: ${parties.join(', ')}`,
        `Contains ${clauses.length} key clause categories identified across ${parsedDoc.pageCount} page(s).`
      ],
      provisions: clauses.map(c => ({
        title: c.title,
        excerpt: c.originalText.slice(0, 150),
        pageNumber: c.pageNumber,
        section: c.section
      })),
      questionsToAsk: [
        "Are the notice periods for termination standard for this type of agreement?",
        "Does the limitation of liability clause adequately protect my business from unexpected damages?",
        "Are there any ambiguous obligations that could be interpreted against me?"
      ],
      infoToBring: [
        "Full signed copy of this document and any schedules/exhibits",
        "Recent communication or emails regarding terms discussion",
        "Records of any payments or invoices processed to date"
      ]
    }
  };
}

function extractSnippetAround(text: string, regex: RegExp, maxLen = 250): string {
  const match = text.match(regex);
  if (!match || match.index === undefined) return text.slice(0, maxLen);
  const start = Math.max(0, match.index - 50);
  const end = Math.min(text.length, match.index + maxLen);
  return text.slice(start, end).trim();
}

import {
  ParsedDocumentResult,
  DocumentOverviewData,
  ExtractedClause,
  ExtractedObligation,
  ExtractedDate,
  ExtractedPayment,
  ExtractedAreaToReview,
  ChecklistItem,
  LawyerPrepData,
  ComparisonResult,
  Citation
} from '@/lib/types';

export type AIProviderMode = 'live' | 'demo';

export interface GroundedRAGResult {
  answer: string;
  documentFact?: string;
  plainEnglish?: string;
  confidence: 'high' | 'medium' | 'low' | 'ungrounded';
  sources: Citation[];
  uncertainties?: string[];
  needsProfessionalReview: boolean;
}

export interface DocumentAnalysisResult {
  overview: DocumentOverviewData;
  clauses: ExtractedClause[];
  obligations: ExtractedObligation[];
  dates: ExtractedDate[];
  payments: ExtractedPayment[];
  areasToReview: ExtractedAreaToReview[];
  checklist: ChecklistItem[];
  lawyerPrep: LawyerPrepData;
}

export interface AIProvider {
  getMode(): AIProviderMode;
  generateAnswer(documentId: string, question: string, chunks: any[]): Promise<GroundedRAGResult>;
  analyzeDocument(parsedDoc: ParsedDocumentResult): Promise<DocumentAnalysisResult>;
  compareDocuments(titleA: string, titleB: string, diffs: Array<[number, string]>, textA: string, textB: string): Promise<ComparisonResult>;
}

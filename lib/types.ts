export interface Citation {
  documentId?: string;
  pageNumber: number;
  section?: string;
  chunkId?: string;
  startOffset?: number;
  endOffset?: number;
  excerpt: string;
}

export interface ParsedDocumentPage {
  pageNumber: number;
  text: string;
  sections: { title: string; text: string; startOffset?: number; endOffset?: number }[];
}

export interface ParsedDocumentResult {
  title: string;
  rawText: string;
  pageCount: number;
  pages: ParsedDocumentPage[];
}

export interface DocumentChunkData {
  chunkIndex: number;
  pageNumber: number;
  section: string;
  content: string;
  startOffset?: number;
  endOffset?: number;
}

export interface ExtractedClause {
  id?: string;
  type: string;
  title: string;
  summary: string;
  originalText: string;
  requires?: string;
  toCheck?: string;
  pageNumber: number;
  section: string;
  confidence: number;
  startOffset?: number;
  endOffset?: number;
}

export interface ExtractedObligation {
  id?: string;
  party: string;
  action: string;
  deadline?: string;
  frequency?: string;
  conditions?: string;
  pageNumber: number;
  section: string;
  status?: string;
}

export interface ExtractedDate {
  id?: string;
  title: string;
  dateValue: string;
  category: 'effective' | 'expiration' | 'renewal' | 'notice' | 'payment' | 'cure' | 'general' | string;
  sourceExcerpt: string;
  pageNumber: number;
  section: string;
}

export interface ExtractedPayment {
  id?: string;
  title: string;
  amount: string;
  currency: string;
  frequency?: string;
  dueDate?: string;
  lateFee?: string;
  interest?: string;
  deposits?: string;
  refunds?: string;
  taxes?: string;
  sourceExcerpt: string;
  pageNumber: number;
  section: string;
}

export interface ExtractedAreaToReview {
  id?: string;
  category: 'Potentially Significant' | 'Unclear' | 'Missing Information' | 'Needs Careful Review' | string;
  finding: string;
  whyItMatters: string;
  questionToConsider: string;
  sourceExcerpt?: string;
  pageNumber: number;
  section: string;
}

export interface ChecklistItem {
  id?: string;
  action: string;
  deadline?: string;
  responsibleParty?: string;
  pageNumber?: number;
  section?: string;
  completed: boolean;
}

export interface DocumentOverviewData {
  documentType: string;
  overview: string;
  parties: string[];
  mainPurpose: string;
  summary: string;
  duration?: string;
  governingLaw?: string;
}

export interface LawyerPrepData {
  keyFacts: string[];
  provisions: { title: string; excerpt: string; pageNumber: number; section: string }[];
  questionsToAsk: string[];
  infoToBring: string[];
}

export interface ComparisonChangeItem {
  id?: string;
  category: string;
  changeType: 'added' | 'removed' | 'modified' | string;
  oldText?: string;
  newText?: string;
  explanation: string;
  location?: string;
}

export interface ComparisonResult {
  title: string;
  overview: string;
  changes: ComparisonChangeItem[];
}

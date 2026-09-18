import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { DEMO_DOCUMENT_ID, DEMO_ANALYSIS_DATA } from '@/lib/services/demoData';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  // Check if requested demo document
  if (id === DEMO_DOCUMENT_ID) {
    return NextResponse.json(DEMO_ANALYSIS_DATA);
  }

  const doc = await prisma.document.findFirst({
    where: {
      id,
      userId: user.id
    },
    include: {
      analysis: true,
      clauses: { orderBy: { pageNumber: 'asc' } },
      obligations: { orderBy: { pageNumber: 'asc' } },
      dates: { orderBy: { pageNumber: 'asc' } },
      payments: { orderBy: { pageNumber: 'asc' } },
      areasToReview: { orderBy: { pageNumber: 'asc' } },
      checklist: { orderBy: { pageNumber: 'asc' } },
      lawyerPrep: true,
      chatMessages: { orderBy: { createdAt: 'asc' } }
    }
  });

  if (!doc) {
    return NextResponse.json({ error: 'Document not found or unauthorized.' }, { status: 404 });
  }

  // Parse lawyerPrep JSON fields if available
  let parsedLawyerPrep = null;
  if (doc.lawyerPrep) {
    try {
      parsedLawyerPrep = {
        keyFacts: JSON.parse(doc.lawyerPrep.keyFactsJson || '[]'),
        provisions: JSON.parse(doc.lawyerPrep.provisionsJson || '[]'),
        questionsToAsk: JSON.parse(doc.lawyerPrep.questionsJson || '[]'),
        infoToBring: JSON.parse(doc.lawyerPrep.infoToBringJson || '[]')
      };
    } catch {
      parsedLawyerPrep = null;
    }
  }

  // Parse overview parties JSON if available
  let overviewData = doc.analysis ? {
    documentType: doc.analysis.documentType || 'Legal Document',
    overview: doc.analysis.overview,
    parties: JSON.parse(doc.analysis.partiesJson || '[]'),
    mainPurpose: doc.analysis.mainPurpose,
    summary: doc.analysis.summary,
    duration: doc.analysis.duration,
    governingLaw: doc.analysis.governingLaw
  } : null;

  return NextResponse.json({
    document: {
      id: doc.id,
      title: doc.title,
      fileName: doc.fileName,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      status: doc.status,
      pageCount: doc.pageCount,
      rawText: doc.rawText,
      createdAt: doc.createdAt
    },
    overview: overviewData,
    clauses: doc.clauses,
    obligations: doc.obligations,
    dates: doc.dates,
    payments: doc.payments,
    areasToReview: doc.areasToReview,
    checklist: doc.checklist,
    lawyerPrep: parsedLawyerPrep,
    chatMessages: doc.chatMessages
  });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  if (id === DEMO_DOCUMENT_ID) {
    return NextResponse.json({ message: 'Demo document reset.' });
  }

  // Delete document and all cascading entities
  const existing = await prisma.document.findFirst({
    where: { id, userId: user.id }
  });

  if (!existing) {
    return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
  }

  await prisma.document.delete({
    where: { id }
  });

  return NextResponse.json({ success: true, message: 'Document and all associated data deleted permanently.' });
}

import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { askDocument } from '@/lib/services/rag';
import { DEMO_DOCUMENT_ID } from '@/lib/services/demoData';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json({ error: 'Please enter a valid question.' }, { status: 400 });
    }

    // Handle demo contract questions
    if (id === DEMO_DOCUMENT_ID) {
      return handleDemoChat(question);
    }

    const doc = await prisma.document.findFirst({
      where: { id, userId: user.id }
    });

    if (!doc) {
      return NextResponse.json({ error: 'Document not found or unauthorized.' }, { status: 404 });
    }

    // Run RAG query pipeline
    const ragResult = await askDocument(id, question);

    // Save user message and assistant answer to database
    await prisma.chatMessage.create({
      data: {
        documentId: id,
        role: 'user',
        content: question
      }
    });

    const assistantMsg = await prisma.chatMessage.create({
      data: {
        documentId: id,
        role: 'assistant',
        content: ragResult.answer,
        sourcesJson: JSON.stringify(ragResult.sources || []),
        uncertaintiesJson: JSON.stringify(ragResult.uncertainties || []),
        needsReview: ragResult.needsProfessionalReview
      }
    });

    return NextResponse.json({
      id: assistantMsg.id,
      role: 'assistant',
      content: ragResult.answer,
      sources: ragResult.sources,
      confidence: ragResult.confidence,
      uncertainties: ragResult.uncertainties,
      needsProfessionalReview: ragResult.needsProfessionalReview
    });

  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}

function handleDemoChat(question: string) {
  const qLower = question.toLowerCase();

  if (qLower.includes('terminate') || qLower.includes('cancellation') || qLower.includes('cancel')) {
    return NextResponse.json({
      id: "demo-msg-" + Date.now(),
      role: 'assistant',
      content: "The agreement states that either party may terminate for convenience by providing thirty (30) days' prior written notice to the other party. Additionally, either party may terminate immediately upon written notice if the other party materially breaches any provision and fails to cure within ten (10) days.",
      sources: [
        {
          documentId: DEMO_DOCUMENT_ID,
          pageNumber: 2,
          section: "SECTION 3. TERM AND TERMINATION",
          excerpt: "Either party may terminate this Agreement for convenience at any time by providing thirty (30) days' prior written notice to the other party."
        }
      ],
      confidence: "high",
      uncertainties: [],
      needsProfessionalReview: false
    });
  }

  if (qLower.includes('pay') || qLower.includes('fee') || qLower.includes('money') || qLower.includes('cost') || qLower.includes('invoice') || qLower.includes('much')) {
    return NextResponse.json({
      id: "demo-msg-" + Date.now(),
      role: 'assistant',
      content: "Client is obligated to pay Contractor a monthly retainer fee of $12,500. Payments are due within fifteen (15) calendar days from receipt of Contractor's monthly invoice, after which past due balances accrue interest at 1.5% per month.",
      sources: [
        {
          documentId: DEMO_DOCUMENT_ID,
          pageNumber: 1,
          section: "SECTION 2. COMPENSATION AND PAYMENT TERMS",
          excerpt: "Client shall pay Contractor a monthly retainer fee of $12,500. Payments are due within fifteen (15) calendar days from receipt of Contractor's monthly invoice."
        }
      ],
      confidence: "high",
      uncertainties: [],
      needsProfessionalReview: false
    });
  }

  if (qLower.includes('renew') || qLower.includes('automatically')) {
    return NextResponse.json({
      id: "demo-msg-" + Date.now(),
      role: 'assistant',
      content: "The agreement has an initial term of twelve (12) months starting October 1, 2026. The contract text does not mention automatic renewal provisions.",
      sources: [
        {
          documentId: DEMO_DOCUMENT_ID,
          pageNumber: 2,
          section: "SECTION 3. TERM AND TERMINATION",
          excerpt: "This Agreement shall commence on the Effective Date and remain in effect for an initial term of twelve (12) months."
        }
      ],
      confidence: "high",
      uncertainties: ["Automatic renewal terms not explicitly stated."],
      needsProfessionalReview: false
    });
  }

  if (qLower.includes('confidential') || qLower.includes('secret') || qLower.includes('privacy')) {
    return NextResponse.json({
      id: "demo-msg-" + Date.now(),
      role: 'assistant',
      content: "Both parties agree to hold non-public technical, business, and financial data in strict confidence. Confidentiality obligations survive termination of the agreement for a period of three (3) years.",
      sources: [
        {
          documentId: DEMO_DOCUMENT_ID,
          pageNumber: 2,
          section: "SECTION 4. CONFIDENTIALITY",
          excerpt: "Confidentiality obligations shall survive termination of this Agreement for a period of three (3) years."
        }
      ],
      confidence: "high",
      uncertainties: [],
      needsProfessionalReview: false
    });
  }

  if (qLower.includes('ask a lawyer') || qLower.includes('lawyer') || qLower.includes('attorney')) {
    return NextResponse.json({
      id: "demo-msg-" + Date.now(),
      role: 'assistant',
      content: "When discussing this document with a legal professional, you may want to ask: 1) Is net-15 payment standard for your industry? 2) Does the liability cap adequately cover potential deliverable delays? 3) Is binding arbitration in San Francisco preferable for your entity?",
      sources: [
        {
          documentId: DEMO_DOCUMENT_ID,
          pageNumber: 3,
          section: "SECTION 7. GOVERNING LAW",
          excerpt: "Any dispute arising out of this Agreement shall be resolved through binding arbitration administered by JAMS in San Francisco, California."
        }
      ],
      confidence: "high",
      uncertainties: [],
      needsProfessionalReview: true
    });
  }

  // Fallback for demo chat questions not explicitly matched
  return NextResponse.json({
    id: "demo-msg-" + Date.now(),
    role: 'assistant',
    content: "Based on the uploaded Freelance Services Agreement, Contractor performs digital engineering services at $12,500/month under California law with 30-day termination notice and 3-year confidentiality.",
    sources: [
      {
        documentId: DEMO_DOCUMENT_ID,
        pageNumber: 1,
        section: "SECTION 1. SERVICES AND DELIVERABLES",
        excerpt: "Contractor agrees to perform digital software design, engineering, and consulting services..."
      }
    ],
    confidence: "medium",
    uncertainties: [],
    needsProfessionalReview: false
  });
}

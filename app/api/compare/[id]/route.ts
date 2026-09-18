import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { DEMO_DOCUMENT_ID, DEMO_CONTRACT_TEXT_V1, DEMO_CONTRACT_TEXT_V2 } from '@/lib/services/demoData';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params;

  if (id === 'demo-comparison-123' || id.startsWith('demo')) {
    return NextResponse.json({
      comparison: {
        id: "demo-comparison-123",
        title: "Comparison: Freelance Agreement v1 vs v2 (Revised)",
        overview: "Detailed clause-by-clause comparison between initial Freelance Agreement v1 and Revised v2. Significant modifications detected in monthly retainer pricing, payment late fee interest rates, termination notice lead time, breach cure windows, and liability cap multiplier.",
        docA: { id: DEMO_DOCUMENT_ID, title: "Freelance Agreement v1", rawText: DEMO_CONTRACT_TEXT_V1 },
        docB: { id: "demo-v2", title: "Freelance Agreement v2 (Revised)", rawText: DEMO_CONTRACT_TEXT_V2 },
        changes: [
          {
            id: "c1",
            category: "Payment",
            changeType: "modified",
            oldText: "Monthly Retainer: $12,500 / Late Fee: 1.5% per month (18% per annum)",
            newText: "Monthly Retainer: $15,000 / Late Fee: 2.5% per month (30% per annum)",
            explanation: "Monthly fee increased by $2,500 (+20%) and past-due invoice late interest increased from 1.5% to 2.5% per month.",
            location: "SECTION 2. COMPENSATION AND PAYMENT TERMS"
          },
          {
            id: "c2",
            category: "Termination",
            changeType: "modified",
            oldText: "30 days' prior written notice for convenience",
            newText: "60 days' prior written notice for convenience",
            explanation: "Termination notice period doubled from 30 days to 60 days, requiring longer advance notice prior to cancellation.",
            location: "SECTION 3. TERM AND TERMINATION"
          },
          {
            id: "c3",
            category: "Cure Period",
            changeType: "modified",
            oldText: "10 days to cure material breach",
            newText: "5 days to cure material breach",
            explanation: "Breach cure window shortened from 10 days to 5 days, accelerating potential immediate cancellation.",
            location: "SECTION 3. TERM AND TERMINATION"
          },
          {
            id: "c4",
            category: "Confidentiality",
            changeType: "modified",
            oldText: "Survives termination for a period of 3 years",
            newText: "Survives termination for a period of 5 years",
            explanation: "Post-contract confidentiality duration extended from 3 years to 5 years.",
            location: "SECTION 4. CONFIDENTIALITY"
          },
          {
            id: "c5",
            category: "Liability",
            changeType: "modified",
            oldText: "Aggregate liability capped at total fees paid in preceding 6 months",
            newText: "Aggregate liability capped at total fees paid in preceding 3 months",
            explanation: "Contractor's liability ceiling reduced from 6 months of retainer fees down to 3 months.",
            location: "SECTION 6. LIMITATION OF LIABILITY"
          }
        ]
      }
    });
  }

  const comp = await prisma.comparison.findFirst({
    where: { id, userId: user.id },
    include: {
      docA: { select: { id: true, title: true, rawText: true } },
      docB: { select: { id: true, title: true, rawText: true } },
      changes: true
    }
  });

  if (!comp) {
    return NextResponse.json({ error: 'Comparison not found.' }, { status: 404 });
  }

  return NextResponse.json({ comparison: comp });
}

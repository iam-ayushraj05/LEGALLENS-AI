import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { compareDocuments } from '@/lib/services/comparison';
import { DEMO_DOCUMENT_ID, DEMO_COMPARISON_DOC_ID } from '@/lib/services/demoData';

export async function POST(req: Request) {
  const user = await getAuthSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { docAId, docBId } = await req.json();

    if (!docAId || !docBId) {
      return NextResponse.json({ error: 'Please select two documents to compare.' }, { status: 400 });
    }

    if (docAId === DEMO_DOCUMENT_ID || docBId === DEMO_COMPARISON_DOC_ID) {
      return NextResponse.json({ comparisonId: "demo-comparison-123" });
    }

    const comparisonId = await compareDocuments(docAId, docBId, user.id);
    return NextResponse.json({ comparisonId });

  } catch (err: any) {
    console.error("Comparison API error:", err);
    return NextResponse.json({ error: 'Failed to generate comparison.' }, { status: 500 });
  }
}

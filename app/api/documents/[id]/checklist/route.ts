import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';
import { DEMO_DOCUMENT_ID } from '@/lib/services/demoData';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { itemId, completed } = await req.json();

    if (params.id === DEMO_DOCUMENT_ID) {
      return NextResponse.json({ success: true, itemId, completed });
    }

    const item = await prisma.checklistItem.update({
      where: { id: itemId },
      data: { completed }
    });

    return NextResponse.json({ success: true, item });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update checklist item' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  const user = await getAuthSession();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const user = await getAuthSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        jurisdiction: body.jurisdiction,
        name: body.name
      },
      select: { id: true, email: true, name: true, jurisdiction: true }
    });

    return NextResponse.json({ user: updated });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}

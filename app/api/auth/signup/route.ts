import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth/session';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
  jurisdiction: z.string().optional()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parse = signupSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: 'Invalid input parameters' }, { status: 400 });
    }

    const { email, password, name, jurisdiction } = parse.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || email.split('@')[0],
        jurisdiction: jurisdiction || 'United States (General)'
      }
    });

    const token = signToken({ userId: user.id, email: user.email });
    setAuthCookie(token);

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, jurisdiction: user.jurisdiction }
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

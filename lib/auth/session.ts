import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'legallens-secret-key-change-in-production-12345678';
const AUTH_COOKIE = 'legallens_session';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

export async function getAuthSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) {
    // Check if demo user can be auto-retrieved or created for zero-friction experience
    return await getOrCreateDefaultUser();
  }

  const payload = verifyToken(token);
  if (!payload) {
    return await getOrCreateDefaultUser();
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, name: true, jurisdiction: true }
  });

  if (!user) {
    return await getOrCreateDefaultUser();
  }

  return user;
}

export async function getOrCreateDefaultUser() {
  let defaultUser = await prisma.user.findFirst({
    where: { email: 'demo@legallens.ai' },
    select: { id: true, email: true, name: true, jurisdiction: true }
  });

  if (!defaultUser) {
    const dummyHash = await hashPassword('demo123456');
    defaultUser = await prisma.user.create({
      data: {
        email: 'demo@legallens.ai',
        name: 'Alex Vance',
        passwordHash: dummyHash,
        jurisdiction: 'United States (General)'
      },
      select: { id: true, email: true, name: true, jurisdiction: true }
    });
  }

  return defaultUser;
}

export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  });
}

export function clearAuthCookie() {
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  });
}

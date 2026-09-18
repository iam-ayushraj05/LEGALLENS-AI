import { NextResponse } from 'next/server';
import { getAIProviderMode } from '@/lib/ai/providerFactory';

export async function GET() {
  const mode = getAIProviderMode();
  return NextResponse.json({
    mode,
    label: mode === 'live' ? 'AI-Powered Analysis' : 'Demo / Local Analysis'
  });
}

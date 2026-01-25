import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// Hardcoded secret - Laravel ile aynı olmalı
const REVALIDATE_SECRET = 'codpanel_revalidate_secret_2026';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');
  
  // Secret doğrulama
  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  try {
    const { tag } = await request.json();
    
    if (!tag) {
      return NextResponse.json({ error: 'Tag is required' }, { status: 400 });
    }
    
    // Cache'i temizle
    revalidateTag(tag);
    
    console.log(`✅ Cache revalidated for tag: ${tag}`);
    
    return NextResponse.json({ revalidated: true, tag });
  } catch (error) {
    console.error('❌ Revalidation error:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}

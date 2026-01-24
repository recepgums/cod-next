import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get real client IP from headers (handles proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  const ip = cfConnectingIp || forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
  
  return NextResponse.json({ ip });
}

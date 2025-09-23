import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint') || 'homepage';

  try {
    // Laravel API'dan veri çek
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'NextJS-API-Proxy/1.0',
      },
      // Cache stratejisi
      next: { revalidate: 60 }, // 1 dakika cache
    });

    if (!response.ok) {
      throw new Error(`Laravel API error: ${response.status}`);
    }

    const data = await response.json();

    // Cache headers ekle
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, s-maxage=60', // 1 dakika cache
      'CDN-Cache-Control': 'public, max-age=300', // CDN için 5 dakika
    });

    return NextResponse.json(data, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Products API proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', products: [] },
      { status: 500 }
    );
  }
}

// OPTIONS method for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
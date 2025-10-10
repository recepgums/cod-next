import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get('url');

  if (!urlParam) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Build absolute URL if a relative path is provided
    let targetUrl: string;
    try {
      // If urlParam is absolute, this will work; if relative, base with origin
      targetUrl = new URL(urlParam, request.nextUrl.origin).toString();
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Only allow http/https
    if (!/^https?:\/\//i.test(targetUrl)) {
      return NextResponse.json({ error: 'Only http/https URLs are allowed' }, { status: 400 });
    }

    // Fetch the image
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'NextJS-Image-Proxy/1.0',
      },
      // Cache stratejisi
      next: { revalidate: 3600 }, // 1 saat cache
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await response.arrayBuffer();

    // Cache headers ekle
    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 1 saat cache
      'CDN-Cache-Control': 'public, max-age=86400', // CDN için 24 saat
    });

    return new NextResponse(imageBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
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
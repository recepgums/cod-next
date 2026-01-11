import { headers } from 'next/headers';

/**
 * Fetches merchant logo URL from the API
 * @returns Promise<string | null> - Logo URL or null if not found
 */
export async function fetchMerchantLogo(): Promise<string | null> {
  try {
    // Get the current domain from headers
    const h = await headers();
    const host = h.get('host');
    const protocol = h.get('x-forwarded-proto') || 'https';
    const baseUrl = process.env.NEXT_IS_LOCAL == "true" 
      ? "https://trendygoods.com.tr" 
      : `${protocol}://${host}`;

    const directRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage`, {
      headers: {
        'Accept': 'application/json',
        'Origin': baseUrl,
        'Referer': `${baseUrl}/`,
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)',
      },
      cache: 'no-store',
    });
    
    if (!directRes.ok) {
      return null;
    }
    
    // Türkçe karakter sorununu önlemek için text olarak alıp parse ediyoruz
    const text = await directRes.text();
    const directData = JSON.parse(text);
    
    // Return logo URL from various possible locations
    return directData?.logoUrl || directData?.merchant?.logo_url || null;
  } catch (error) {
    console.error('Error fetching merchant logo:', error);
    return null;
  }
}

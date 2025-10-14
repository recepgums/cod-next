import Header from './Header';

export default async function ServerHeader() {
  let categories: any[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': process.env.NEXT_PUBLIC_WEBSITE_URL,
        'Referer': `${process.env.NEXT_PUBLIC_WEBSITE_URL}/`,
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS-SSR/1.0)'
      },
      next: { revalidate: 300 }
    });
    if (res.ok) {
      categories = await res.json();
    }
  } catch {}

  return <Header categories={categories} />;
}



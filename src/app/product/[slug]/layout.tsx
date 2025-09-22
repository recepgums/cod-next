import type { Metadata } from 'next';

type LayoutProps = {
  children: React.ReactNode;
  params: { slug: string };
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const slug = params.slug;

  if (!apiUrl || !slug) {
    return { title: 'Ürün' };
  }

  try {
    const res = await fetch(`${apiUrl}/product/${slug}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Ürün' };
    const data = await res.json();
    const productName: string | undefined = data?.product?.name;
    return {
      title: productName || 'Ürün'
    };
  } catch {
    return { title: 'Ürün' };
  }
}

export default function ProductSlugLayout({ children }: LayoutProps) {
  return (
    <>{children}</>
  );
}



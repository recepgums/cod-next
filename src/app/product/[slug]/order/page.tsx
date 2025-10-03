'use client';

import OrderTemplate from './OrderTemplate';
import { useParams } from 'next/navigation';

export default function OrderPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  
  return <OrderTemplate slug={slug} />;
}
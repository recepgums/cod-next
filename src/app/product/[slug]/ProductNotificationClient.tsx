'use client';

import React from 'react';
import FloatingNotification from '../../components/FloatingNotification';
import { randomNumber } from '@/app/utils/priceUtils';


const runIntervalMs = process.env.NEXT_IS_LOCAL == "true" ? 10000 : randomNumber(10000, 20000);

interface ProductNotificationClientProps {
  product?: any;
}

export default function ProductNotificationClient({product}: ProductNotificationClientProps) {

  return <FloatingNotification intervalMs={runIntervalMs} visibleMs={5000} product={product} />;
}

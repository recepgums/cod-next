'use client';

import React from 'react';
import FloatingNotification from '../../components/FloatingNotification';
import { randomNumber } from '@/app/utils/priceUtils';

const runIntervalMs = process.env.NEXT_IS_LOCAL == "true" ? 10000 : randomNumber(10000, 20000);
export default function ProductNotificationClient() {
  return <FloatingNotification intervalMs={runIntervalMs} visibleMs={5000} />;
}

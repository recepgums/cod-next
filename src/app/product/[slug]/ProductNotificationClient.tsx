'use client';

import React from 'react';
import FloatingNotification from '../../components/FloatingNotification';
import { randomNumber } from '@/app/utils/priceUtils';

const runIntervalMs = randomNumber(10000, 100000);
export default function ProductNotificationClient() {
  return <FloatingNotification intervalMs={runIntervalMs} visibleMs={5000} />;
}

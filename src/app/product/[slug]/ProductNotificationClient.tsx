'use client';

import React from 'react';
import FloatingNotification from '../../components/FloatingNotification';

export default function ProductNotificationClient() {
  return <FloatingNotification intervalMs={40000} visibleMs={6000} />;
}

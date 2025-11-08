"use client";

import React, { useEffect, useRef, useState } from "react";

interface FloatingNotificationProps {
  intervalMs?: number; // default 40000
  visibleMs?: number; // default 6000
}

export default function FloatingNotification({ intervalMs = 40000, visibleMs = 6000 }: FloatingNotificationProps) {
  const [show, setShow] = useState(false);
  const [nameCity, setNameCity] = useState<{ name: string; city: string }>({ name: 'R. Yıldız', city: 'İstanbul' });
  const [minutesAgo, setMinutesAgo] = useState<number>(7);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hideRef = useRef<NodeJS.Timeout | null>(null);

  const names = useRef<string[]>([
    'A. Demir','E. Şahin','M. Yıldırım','B. Kaya','H. Çelik','S. Yıldız','K. Koç','N. Arslan','G. Kılıç','T. Özdemir',
    'R. Polat','D. Acar','C. Kaplan','Y. Uçar','İ. Yavuz','Z. Çetin','P. Aydın','F. Bozkurt','V. Duman','L. Karaca',
    'O. Akın','U. Doğan','I. Korkmaz','Ş. Erdem','Ü. Sarı','S. Aksoy','M. Eker','E. Tunç','K. Taş','N. Güner'
  ]).current;
  const cities = useRef<string[]>([
    'İstanbul','Ankara','İzmir','Bursa','Antalya','Adana','Konya','Şanlıurfa','Gaziantep','Kocaeli',
    'Mersin','Diyarbakır','Hatay','Kayseri','Samsun','Tekirdağ','Balıkesir','Aydın','Manisa','Sakarya',
    'Eskişehir','Trabzon','Van','Malatya','Kahramanmaraş','Erzurum','Muğla','Denizli','Ordu','Sivas'
  ]).current;
  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  useEffect(() => {
    const trigger = () => {
      setNameCity({ name: pick(names), city: pick(cities) });
      setMinutesAgo(1 + Math.floor(Math.random() * 10));
      setShow(true);
      if (hideRef.current) clearTimeout(hideRef.current);
      hideRef.current = setTimeout(() => setShow(false), visibleMs);
    };

    // initial delay to avoid immediate popup if needed
    timerRef.current = setTimeout(function loop() {
      trigger();
      timerRef.current = setTimeout(loop, intervalMs);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, [intervalMs, visibleMs]);

  return (
    <div className={`notification-float${show ? " show" : ""}`} aria-live="polite" aria-atomic="true">
      <div className="notification-card">
        <div className="notification-header">
          <div className="icon-circle">
            <div className="shopping-icon">🛍️</div>
          </div>
          <div className="header-content">
            <div className="header-title">YENİ SİPARİŞ</div>
          </div>
        </div>
        <div className="order-message">
          <span className="customer-highlight">{nameCity.name} ({nameCity.city})</span> hızlı kargo ile bugün sipariş oluşturdu!
        </div>
        <div className="time-badge">{minutesAgo} dakika önce</div>
      </div>
    </div>
  );
}

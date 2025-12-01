"use client";

import React, { useEffect, useRef, useState } from "react";
import { randomNumber } from "../utils/priceUtils";

interface FloatingNotificationProps {
  intervalMs?: number; // default 40000
  visibleMs?: number; // default 6000
  product?: any;
}

export default function FloatingNotification({ intervalMs = 40000, visibleMs = 6000, product }: FloatingNotificationProps) {
  const [show, setShow] = useState(false);
  const [nameCity, setNameCity] = useState<{ name: string; city: string }>({ name: 'R. Yıldız', city: 'İstanbul' });
  const [minutesAgo, setMinutesAgo] = useState<number>(7);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hideRef = useRef<NodeJS.Timeout | null>(null);

  // const names = useRef<string[]>([
  //   'A. Demir','E. Şahin','M. Yıldırım','B. Kaya','H. Çelik','S. Yıldız','K. Koç','N. Arslan','G. Kılıç','T. Özdemir',
  //   'R. Polat','D. Acar','C. Kaplan','Y. Uçar','İ. Yavuz','Z. Çetin','P. Aydın','F. Bozkurt','V. Duman','L. Karaca',
  //   'O. Akın','U. Doğan','I. Korkmaz','Ş. Erdem','Ü. Sarı','S. Aksoy','M. Eker','E. Tunç','K. Taş','N. Güner'
  // ]).current;
  const names = useRef<string[]>([
    'Ahmet Demir', 'Emre Şahin', 'Mehmet Yıldırım', 'Burak Kaya', 'Hasan Çelik', 'Seda Yıldız', 'Kerem Koç', 'Nazan Arslan', 'Gamze Kılıç', 'Tolga Özdemir',
    'Rıza Polat', 'Deniz Acar', 'Cem Kaplan', 'Yusuf Uçar', 'İsmail Yavuz', 'Zeynep Çetin', 'Pelin Aydın', 'Fatma Bozkurt', 'Volkan Duman', 'Levent Karaca',
    'Okan Akın', 'Umut Doğan', 'Işık Korkmaz', 'Şule Erdem', 'Ümit Sarı', 'Selin Aksoy', 'Murat Eker', 'Eren Tunç', 'Kaan Taş', 'Necla Güner'
  ]).current;

  const cities = useRef<string[]>([
    'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Şanlıurfa', 'Gaziantep', 'Kocaeli',
    'Mersin', 'Diyarbakır', 'Hatay', 'Kayseri', 'Samsun', 'Tekirdağ', 'Balıkesir', 'Aydın', 'Manisa', 'Sakarya',
    'Eskişehir', 'Trabzon', 'Van', 'Malatya', 'Kahramanmaraş', 'Erzurum', 'Muğla', 'Denizli', 'Ordu', 'Sivas'
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

    const nextDelay = () => {

      if (intervalMs && intervalMs > 20000) {
        const min = Math.max(10000, intervalMs - 5000);
        const max = intervalMs + 5000;
        return randomNumber(min, max);
      }
      return randomNumber(15000, 30000);
    };

    const schedule = () => {
      trigger();
      timerRef.current = setTimeout(schedule, nextDelay());
    };

    timerRef.current = setTimeout(schedule, nextDelay());

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, [intervalMs, visibleMs]);

  return (
    <div className={`notification-float${show ? " show" : ""}`} aria-live="polite" aria-atomic="true">
      <div className="notification-card">
        {/* <div className="notification-header">
          <div className="icon-circle">
            <div className="shopping-icon">🛍️</div>
          </div>
          <div className="header-content">
            <div className="header-title">YENİ SİPARİŞ</div>
          </div>
        </div> */}
        <div className="order-message">
          <span className="customer-highlight">{nameCity.name} ({nameCity.city})</span> {(() => {
            let adet = 1;

            if (product.price < 600) adet = randomNumber(1, 3);
            else if (product.price < 1000) adet = randomNumber(1, 2);

            return adet;
          })()} adet {product.name} siparişi verdi!
        </div>
        <div className="time-badge">{minutesAgo} dakika önce</div>
      </div>
    </div>
  );
}

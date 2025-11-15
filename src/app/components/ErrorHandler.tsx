'use client';

import axios from 'axios';
import { useEffect } from 'react';

export default function ErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
        const errorMessage = event.error?.message || event.message || 'Bilinmeyen hata';
        const domain = typeof window !== 'undefined' ? window.location.origin : 'Bilinmeyen domain';
        const errorDetails = `Hata çıktı [${domain}]: ${errorMessage}`;
        // axios.post("https://bailey.codpanel.com.tr/send-message", {
        //   laravelPayload: "eyJpdiI6IkE2L1F3KzBPeWx2WGdjblRvYi9Oemc9PSIsInZhbHVlIjoiU05FcjUyZ2RsNGNvZlYwVVM4bkgvdz09In0=",
        //   to: "905350339711",
        //   message: errorDetails
        // })
        // .then(res => console.log(res.data))
        // .catch(err => console.error(err));
        // axios.post("https://bailey.codpanel.com.tr/send-message", {
        //   laravelPayload: "eyJpdiI6IkE2L1F3KzBPeWx2WGdjblRvYi9Oemc9PSIsInZhbHVlIjoiU05FcjUyZ2RsNGNvZlYwVVM4bkgvdz09In0=",
        //   to: "905393116119",
        //   message: errorDetails
        // })
        // .then(res => console.log(res.data))
        // .catch(err => console.error(err));
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
        const errorMessage = event.reason?.message || String(event.reason) || 'Bilinmeyen hata';
        const domain = typeof window !== 'undefined' ? window.location.origin : 'Bilinmeyen domain';
        const errorDetails = `Hata çıktı [${domain}]: ${errorMessage}`;
        // axios.post("https://bailey.codpanel.com.tr/send-message", {
        //   laravelPayload: "eyJpdiI6IkE2L1F3KzBPeWx2WGdjblRvYi9Oemc9PSIsInZhbHVlIjoiU05FcjUyZ2RsNGNvZlYwVVM4bkgvdz09In0=",
        //   to: "905350339711",
        //   message: errorDetails
        // })
        // .then(res => console.log(res.data))
        // .catch(err => console.error(err));
        // axios.post("https://bailey.codpanel.com.tr/send-message", {
        //   laravelPayload: "eyJpdiI6IkE2L1F3KzBPeWx2WGdjblRvYi9Oemc9PSIsInZhbHVlIjoiU05FcjUyZ2RsNGNvZlYwVVM4bkgvdz09In0=",
        //   to: "905393116119",
        //   message: errorDetails
        // })
        // .then(res => console.log(res.data))
        // .catch(err => console.error(err));
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);
  
  return null;
}


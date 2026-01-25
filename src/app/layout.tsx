import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ScriptLoader from "./components/ScriptLoader";
import ErrorHandler from "./components/ErrorHandler";

// Tek font kullan - self-hosted, render-blocking degil
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Kapıda Ödemeli",
  description: "Kapıda Ödemeli Alışveriş",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to API server */}
        <link rel="preconnect" href="https://codpanel.com.tr" />
        <link rel="dns-prefetch" href="https://codpanel.com.tr" />
        
        {/* Preconnect to CDNs for faster resource loading */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.dsmcdn.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for analytics (lower priority) */}
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
      </head>
      <body className={poppins.variable} style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}>
        <ScriptLoader />
        <ErrorHandler />
        {children}
      </body>
    </html>
  );
}

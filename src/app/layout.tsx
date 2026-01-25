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
      </head>
      <body className={poppins.variable} style={{ fontFamily: 'var(--font-poppins), system-ui, sans-serif' }}>
        <ScriptLoader />
        <ErrorHandler />
        {children}
      </body>
    </html>
  );
}

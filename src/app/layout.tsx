import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Farmer Support - AI-Powered Farming Assistant',
    template: '%s | Farmer Support'
  },
  description: 'Complete farming support platform with AI assistant, crop detection, weather alerts, mandi prices, and government schemes for Indian farmers.',
  keywords: ['farming', 'agriculture', 'AI assistant', 'crop detection', 'weather', 'mandi prices', 'government schemes', 'Indian farmers'],
  authors: [{ name: 'Farmer Support Team' }],
  creator: 'Farmer Support Team',
  publisher: 'Farmer Support',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
  themeColor: '#16a34a',
  colorScheme: 'light',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://farmer-support.vercel.app',
    title: 'Farmer Support - AI-Powered Farming Assistant',
    description: 'Complete farming support platform with AI assistant, crop detection, weather alerts, and more.',
    siteName: 'Farmer Support',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farmer Support - AI-Powered Farming Assistant',
    description: 'Complete farming support platform with AI assistant, crop detection, weather alerts, and more.',
    creator: '@farmer_support',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

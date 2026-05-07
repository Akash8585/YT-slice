import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';

import "./globals.css";

const siteUrl = "https://ytplaylistlength.acash.dev";
const siteTitle = "YouTube Playlist Length Calculator - YT Slice";
const siteDescription =
  "Calculate the length of a full YouTube playlist or choose a custom video range. Get total duration, average video length, and watch-time estimates at different playback speeds.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | YT Slice",
  },
  description: siteDescription,
  keywords: [
    "YouTube playlist length",
    "YouTube playlist duration calculator",
    "playlist length calculator",
    "YouTube playlist watch time",
    "custom playlist range calculator",
    "YT Slice",
  ],
  authors: [{ name: "YT Slice" }],
  creator: "YT Slice",
  publisher: "YT Slice",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "YT Slice",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#app`,
        name: "YT Slice",
        alternateName: "YouTube Playlist Length Calculator",
        url: siteUrl,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        description: siteDescription,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Calculate total YouTube playlist length",
          "Choose a custom start and end video range",
          "Estimate watch time at 1x, 1.25x, 1.5x, 1.75x, and 2x playback speeds",
          "Show selected video durations and average video length",
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4887013408044651"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />

      </body>
    </html>
  );
}

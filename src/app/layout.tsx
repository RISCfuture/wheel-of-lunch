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
  title: "Wheel of Lunch - Discover Your Next Meal",
  description: "Can't decide where to eat? Spin the Wheel of Lunch! Discover nearby restaurants with our interactive roulette wheel. Find walkable lunch spots based on your location, price, and open hours.",
  keywords: "lunch finder, restaurant picker, food decision, lunch roulette, restaurant wheel, nearby restaurants, lunch spots",
  authors: [{ name: "Wheel of Lunch" }],
  creator: "Wheel of Lunch",
  publisher: "Wheel of Lunch",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://wheel-of-lunch.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Wheel of Lunch - Discover Your Next Meal",
    description: "Can't decide where to eat? Spin the Wheel of Lunch! Discover nearby restaurants with our interactive roulette wheel.",
    url: "https://wheel-of-lunch.vercel.app",
    siteName: "Wheel of Lunch",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wheel of Lunch - Interactive Restaurant Picker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wheel of Lunch - Discover Your Next Meal",
    description: "Can't decide where to eat? Spin the Wheel of Lunch! Find nearby restaurants with our interactive roulette wheel.",
    images: ["/og-image.png"],
    creator: "@wheeloflunch",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Wheel of Lunch" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

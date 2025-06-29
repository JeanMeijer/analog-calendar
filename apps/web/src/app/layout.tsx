import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { SimpleAnalytics } from "@simpleanalytics/next";

import ogImage from "@/assets/og-image.png";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  display: "swap",
  weight: "500",
});

export const metadata: Metadata = {
  title: "Analog",
  description: "A calendar that understands your life.",
  openGraph: {
    title: "Analog",
    description: "A calendar that understands your life.",
    url: "https://analog.now",
    siteName: "Analog",
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
        alt: "Analog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: "Analog",
    description: "A calendar that understands your life.",
    site: "@analogdotnow",
    card: "summary_large_image",
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
        alt: "Analog",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${satoshi.variable} flex min-h-screen flex-col antialiased`}
      >
        <Providers>
          <Toaster richColors closeButton position="bottom-right" />
          {children}
        </Providers>
        <SimpleAnalytics collectDnt />
      </body>
    </html>
  );
}

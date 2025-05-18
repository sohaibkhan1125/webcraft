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
  title: "Web Craft Kit",
  description: "Web Craft Kit is a platform for creating and sharing web projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense code */}
        <meta name="google-adsense-account" content="ca-pub-9704392757395060" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9704392757395060" crossOrigin="anonymous"></script>
        {/* Google AdSense Verification */}
        <meta name="google-adsense-verification" content="google.com, pub-9704392757395060, DIRECT, f08c47fec0942fa0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

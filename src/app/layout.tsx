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
  title: "Kingdom Wealth Summit (KWS) 2026 | Dominion Mandate",
  description:
    "Finish Rich Africa presents Kingdom Wealth Summit 2026 convened by Dr. Temilola Adeyemi. 28th November 2026 at Eridan Space, Alausa Ikeja, Lagos & Global Live Stream.",
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-emerald-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sensitivity Ratchet — AI permissions that only shrink",
  description:
    "Irreversible permission narrowing for AI agents. Once an agent reads sensitive data, its write/delete/execute permissions are permanently removed. No API can restore them.",
  openGraph: {
    title: "Sensitivity Ratchet",
    description: "AI permissions that only shrink. Never expand.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} dark`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 font-mono antialiased">
        {children}
      </body>
    </html>
  );
}

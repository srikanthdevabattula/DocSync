import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppFooter } from "@/components/common/AppFooter";
import { AppProviders } from "@/components/providers/app-providers";
import { appConfig } from "@/lib/env";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: appConfig.name,
  description: "Local-first collaborative document editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background text-foreground"
        suppressHydrationWarning
      >
        <AppProviders>
          <main className="pb-20">{children}</main>
          <AppFooter />
        </AppProviders>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ConsoleInterceptorInit from "@/app/components/ConsoleInterceptorInit";
import ServerLogsInjector from "@/app/components/ServerLogsInjector";
// Import console interceptor on server to start capturing server logs
import { consoleInterceptor } from "@/app/components/consoleInterceptor";

// Clear server logs at the start of each request to prevent cross-request contamination
if (typeof window === "undefined") {
  consoleInterceptor.clearServerLogs();
}

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
    default: "React Hooks Execution Order Visualization",
    template: "%s | React Hooks Execution Order",
  },
  description:
    "Explore how React hooks execute with and without React Compiler, with detailed console logs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ServerLogsInjector />
        <ConsoleInterceptorInit />
        {children}
      </body>
    </html>
  );
}

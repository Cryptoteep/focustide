import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/focustide/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://focustide.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FocusTide — Privacy-first focus timer & deep-work analytics",
    template: "%s · FocusTide",
  },
  description:
    "FocusTide is a privacy-first, open-source focus timer and deep-work analytics app for developers. Your data never leaves your browser. 100% local, free, no accounts, no telemetry.",
  keywords: [
    "focus timer",
    "pomodoro",
    "deep work",
    "productivity",
    "privacy",
    "local-first",
    "open source",
    "developer tools",
    "FocusTide",
  ],
  authors: [{ name: "FocusTide Contributors" }],
  creator: "FocusTide",
  license: "MIT",
  openGraph: {
    title: "FocusTide — Privacy-first focus timer & deep-work analytics",
    description:
      "Open-source, local-first focus timer for developers. No accounts, no servers, no telemetry.",
    url: siteUrl,
    siteName: "FocusTide",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FocusTide",
    description:
      "Privacy-first, open-source focus timer & deep-work analytics for developers.",
  },
  icons: {
    icon: "/logo.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0fb5a8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f14" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster />
          <SonnerToaster position="bottom-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

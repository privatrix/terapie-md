import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ForcePasswordChange } from "@/components/auth/ForcePasswordChange";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Terapie.md - Găsește-ți liniștea",
  description: "Conectăm moldovenii cu terapeuți verificați și oferte de wellness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          inter.variable,
          outfit.variable
        )}
      >
        <Header />
        <ForcePasswordChange />
        <main className="flex-1">
          {children}
        </main>
        <Footer />

        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-34CDSCNPQX" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-34CDSCNPQX');
          `}
        </Script>
      </body>
    </html>
  );
}

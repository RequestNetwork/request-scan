/** @format */

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import Header from "@/components/header";
import { cn } from "@/lib/utils";
import { GoogleTagManager } from "@next/third-parties/google";
import { Suspense } from "react";
import Providers from "./providers";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Request Scan (The Request Network Explorer)",
  description:
    "Request Scan allows you to explore and search the Request Network for requests, payments, addresses, other activities taking place on Request Network Protocol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          montserrat.variable,
        )}
      >
        <Providers>
          <div className="flex flex-col">
            <header>
              <Header />
            </header>
            <main>
              <div className="grid grid-cols-1">
                <div className="col-start-1 row-start-1 bg-emerald-900 h-96 p-10" />
                <div className="col-start-1 row-start-1">
                  <div className="flex flex-col py-10 px-5 md:px-16 lg:px-32">
                    <Suspense fallback={<div>Loading...</div>}>
                      {children}
                    </Suspense>
                  </div>
                </div>
              </div>
            </main>
            <footer className="flex flex-col min-h-52 justify-center bg-emerald-900 border-t">
              <Footer />
            </footer>
          </div>
        </Providers>
      </body>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID as string} />
    </html>
  );
}

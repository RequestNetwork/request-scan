/** @format */

import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import { Footer } from '@/components/footer';
import Providers from './providers';
import { Suspense } from 'react';

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Request Scan (The Request Network Explorer)',
  description:
    'Request Scan allows you to explore and search the Request Network for requests, payments, addresses, other activities taking place on Request Network Protocol.',
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
          'min-h-screen bg-background font-sans antialiased',
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
                  <div className="flex flex-col py-10 md:px-32">
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
    </html>
  );
}

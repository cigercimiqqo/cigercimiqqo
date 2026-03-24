import type { Metadata } from 'next';
import { Noto_Serif, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { FaviconUpdater } from '@/components/site/FaviconUpdater';

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Restoran',
    template: '%s | Restoran',
  },
  description: 'Online sipariş platformu',
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="light" suppressHydrationWarning>
      <body className={`${notoSerif.variable} ${inter.variable} grain font-body antialiased`}>
        <Providers>
          <FaviconUpdater />
          {children}
        </Providers>
      </body>
    </html>
  );
}

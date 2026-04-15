import { Inter, Lusitana } from 'next/font/google';

// Font utama (biasanya untuk body)
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Font khusus (yang kamu pakai di acme-logo.tsx)
export const lusitana = Lusitana({
  subsets: ['latin'],
  weight: ['400', '700'],
});
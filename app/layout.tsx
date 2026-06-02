import '@/app/ui/global.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Anagata Oceanics',
    default: 'Anagata Oceanics - Maritime Logistics',
  },
  description: 'Solusi Logistik Maritim & Manajemen Armada Kapal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}

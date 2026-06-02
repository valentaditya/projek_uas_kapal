import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manajemen Rute Pelayaran',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

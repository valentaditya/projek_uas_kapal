import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kirim Paket',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

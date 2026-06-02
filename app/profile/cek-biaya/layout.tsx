import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cek Estimasi Biaya',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

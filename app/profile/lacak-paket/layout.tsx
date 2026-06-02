import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lacak Paket',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analitik Performa',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

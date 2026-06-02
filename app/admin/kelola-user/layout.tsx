import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola User',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

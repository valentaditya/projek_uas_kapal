import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pengelolaan Pengiriman',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

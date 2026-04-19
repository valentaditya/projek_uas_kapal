import type { Metadata } from 'next';
import ProfileNavbar from './components/Navbar';
import ProfileFooter from './components/Footer';

export const metadata: Metadata = {
  title: 'Anagata Oceanics - Maritime Logistics',
  description: 'Solusi Logistik Maritim & Manajemen Armada Kapal',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white font-sans selection:bg-purple-500/30">
      <ProfileNavbar />
      <main className="flex-grow flex flex-col items-center w-full">
        {children}
      </main>
      <ProfileFooter />
    </div>
  );
}

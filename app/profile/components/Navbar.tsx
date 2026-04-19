'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const navLinks = [
  { name: 'Beranda', href: '/profile' },
  { name: 'Tentang', href: '/profile/tentang' },
  { name: 'Layanan', href: '/profile/layanan' },
  { name: 'Lacak Paket', href: '/profile/lacak-paket' },
  { name: 'Cek Biaya', href: '/profile/cek-biaya' },
  { name: 'Kontak', href: '/profile/kontak' },
];

export default function ProfileNavbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#0d1321] text-white">
      <div className="flex items-center gap-4 ml-10">
        <div className="w-10 h-10 relative flex-shrink-0">
          <Image src="/profile/icon.png" alt="Anagata Oceanics Logo" fill className="object-contain" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-widest text-[#a35de9] uppercase drop-shadow-[0_0_10px_rgba(163,93,233,0.5)]">
            ANAGATA OCEANICS
          </h1>
          <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">Solusi Logistik Maritim</p>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-10">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-all ${
                isActive ? 'text-[#b06aee] drop-shadow-[0_0_8px_rgba(176,106,238,0.6)]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <Link href="/login" className="flex items-center gap-2 px-5 py-2 mr-10 bg-[#a35de9] hover:bg-[#8643c7] transition-all text-sm font-semibold rounded shadow-[0_0_15px_rgba(163,93,233,0.3)]">
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        Masuk ke Sistem
      </Link>
    </nav>
  );
}

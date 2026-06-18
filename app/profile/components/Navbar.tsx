'use client';
 
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
 
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0d1321] text-white">
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4 ml-2 md:ml-4 lg:ml-10">
          <div className="w-8 h-8 md:w-10 md:h-10 relative flex-shrink-0">
            <Image src="/profile/icon.png" alt="Anagata Oceanics Logo" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm md:text-lg font-bold tracking-widest text-[#a35de9] uppercase drop-shadow-[0_0_10px_rgba(163,93,233,0.5)]">
              ANAGATA OCEANICS
            </h1>
            <p className="text-[8px] md:text-[10px] text-gray-400 tracking-[0.2em] uppercase">Solusi Logistik Maritim</p>
          </div>
        </div>
 
        <div className="hidden lg:flex items-center gap-6 xl:gap-10">
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
 
        <div className="hidden sm:flex items-center gap-2 mr-2 md:mr-4 lg:mr-10">
          <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-[#a35de9] hover:bg-[#8643c7] transition-all text-xs md:text-sm font-semibold rounded shadow-[0_0_15px_rgba(163,93,233,0.3)]">
            <ArrowRightOnRectangleIcon className="w-4 h-4 md:w-5 md:h-5" />
            Masuk ke Sistem
          </Link>
        </div>

        {/* Mobile menu controls */}
        <div className="flex lg:hidden items-center gap-3 mr-2">
          <Link href="/login" className="flex sm:hidden items-center gap-1.5 px-3 py-1.5 bg-[#a35de9] hover:bg-[#8643c7] transition-all text-xs font-semibold rounded shadow-sm">
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            <span>Masuk</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0d1321]/95 backdrop-blur-md border-b border-white/5 py-4 px-6 flex flex-col gap-4 lg:hidden shadow-xl animate-in fade-in slide-in-from-top-5 duration-200 z-50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium py-2 border-b border-white/5 transition-all ${
                  isActive ? 'text-[#b06aee] font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

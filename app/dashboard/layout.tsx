"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../utils/supabase/client';
import { 
  CubeIcon,
  PaperAirplaneIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState('Customer User');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
        return null;
      };

      const session = getCookie('session_user');
      if (!session) {
        router.replace('/login');
        return;
      }

      try {
        const user = JSON.parse(session);
        if (user.role !== 'User') {
          router.replace('/admin/dashboard');
          return;
        }
        setUsername(user.nama_lengkap || user.username || 'User');
        setIsLoading(false);
      } catch (e) {
        router.replace('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    // Clear session cookie
    document.cookie = "session_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0e1017] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#b06aee]/30 border-t-[#b06aee] rounded-full animate-spin"></div>
      </div>
    );
  }

  const navLinks = [
    { name: 'Pelacakan', icon: CubeIcon, path: '/dashboard' },
    { name: 'Kirim Paket', icon: PaperAirplaneIcon, path: '/dashboard/kirim-paket' },
    { name: 'Profil', icon: UserIcon, path: '/dashboard/profil' }
  ];

  return (
    <div className="min-h-screen bg-[#0e1017] text-gray-200 font-mono text-sm selection:bg-purple-500/30 flex flex-col">
      <nav className="w-full bg-[#12111d]/90 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-[1500px] mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <Image src="/profile/icon.png" alt="Logo" width={30} height={30} className="object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#b06aee] to-cyan-400 text-base tracking-widest leading-tight">
                ANAGATA OCEANICS
              </h1>
              <p className="text-[9px] text-gray-500 tracking-wider uppercase">Sistem Pelacakan Pengiriman</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link key={link.name} href={link.path}>
                  <button className={`flex items-center gap-2 px-5 py-2 rounded-md transition-colors text-xs tracking-wider ${
                    isActive
                      ? 'bg-[#b06aee] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] font-bold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}>
                    <Icon className="w-4 h-4" /> {link.name}
                  </button>
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-300">{username}</span>
              <div className="h-4 w-[1px] bg-white/10"></div>
              <span className="text-[10px] text-gray-500 tracking-wider font-semibold">PENGGUNA</span>
            </div>
            
            <div className="h-8 w-[1px] bg-white/10"></div>
            
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-rose-400 transition-colors">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>

          {/* Mobile Hamburguer Menu Button */}
          <div className="flex lg:hidden items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Buka menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs h-full bg-[#12111d] border-l border-purple-500/20 p-6 flex flex-col justify-between shadow-2xl z-10 animate-slide-in">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 relative flex items-center justify-center">
                    <Image src="/profile/icon.png" alt="Logo" width={24} height={24} className="object-contain" />
                  </div>
                  <div>
                    <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#b06aee] to-cyan-400 text-sm tracking-widest leading-tight">
                      ANAGATA
                    </h2>
                    <p className="text-[8px] text-gray-500 tracking-wider uppercase">Menu Pengguna</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Tutup menu"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Profile Account Info */}
              <div className="py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[#b06aee] font-bold text-xs uppercase">
                    {username.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-200 text-xs">{username}</span>
                    <span className="text-[9px] text-gray-500 tracking-wider uppercase font-semibold mt-0.5">PENGGUNA</span>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="py-4 space-y-2 max-h-[55vh] overflow-y-auto custom-scrollbar">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.path;
                  return (
                    <Link 
                      key={link.name} 
                      href={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors text-xs ${
                        isActive 
                          ? 'bg-[#b06aee]/20 text-white font-bold' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}>
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{link.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-4 border-t border-white/10">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors text-xs font-bold font-mono tracking-wider"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>KELUAR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

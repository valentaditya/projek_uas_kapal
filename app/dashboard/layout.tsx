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
} from '@heroicons/react/24/outline';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState('Customer User');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace('/login');
        return;
      }

      if (user.email && user.email.endsWith('@adminnav.com')) {
        router.replace('/admin/dashboard');
        return;
      }

      if (user.user_metadata?.username) {
        setUsername(user.user_metadata.username);
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
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

          <div className="flex items-center gap-4 text-xs">
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
        </div>
      </nav>

      {children}
    </div>
  );
}

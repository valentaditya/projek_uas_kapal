"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '../../utils/supabase/client';
import { 
  Square3Stack3DIcon,
  MapIcon, 
  ChartBarIcon, 
  UsersIcon, 
  WrenchScrewdriverIcon, 
  ArrowRightOnRectangleIcon,
  BellIcon,
  CubeIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const ShipIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
    <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
    <path d="M12 10v4" />
    <path d="M12 2v3" />
  </svg>
);

const AnchorIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="5" r="3" />
    <line x1="12" x2="12" y1="22" y2="8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
  </svg>
);

const AnalyticsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4v16h16" />
    <path d="M8 16v-4" />
    <path d="M12 16V6" />
    <path d="M16 16v-6" />
  </svg>
);

const RoutePathIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="19" r="2.5" />
    <path d="M15.5 5H8a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h8a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H8.5" />
  </svg>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState('Admin Logistik');
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.replace('/login');
        return;
      }

      if (!user.email || !user.email.endsWith('@adminnav.com')) {
        router.replace('/dashboard');
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

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ShipIcon },
    { name: 'Kelola Kapal', href: '/admin/kelola-kapal', icon: AnchorIcon },
    { name: 'Analitik', href: '/admin/analitik', icon: AnalyticsIcon },
    { name: 'Rute', href: '/admin/rute', icon: RoutePathIcon },
    { name: 'Pengiriman', href: '/admin/pengiriman', icon: CubeIcon },
    { name: 'Peta', href: '/admin/peta', icon: MapIcon },
    { name: 'Kelola User', href: '/admin/kelola-user', icon: UsersIcon },
  ];

  const notifications = [
    { id: 1, title: 'Pengiriman Selesai', message: 'Pengiriman AO-2026-001 telah sampai tujuan', time: '1 menit yang lalu', icon: CubeIcon, iconColor: 'text-cyan-500', isUnread: true },
    { id: 2, title: 'Kapal ANAGATA-01 Tiba', message: 'ANAGATA-01 telah tiba di pelabuhan Jakarta', time: '6 menit yang lalu', icon: ShipIcon, iconColor: 'text-[#b06aee]', isUnread: true },
    { id: 3, title: 'Request Pengiriman Baru', message: 'Request pengiriman SR003 menunggu persetujuan', time: '16 menit yang lalu', icon: CubeIcon, iconColor: 'text-cyan-500', isUnread: true },
    { id: 4, title: 'Pengiriman Disetujui', message: 'Request SR002 telah disetujui dan dialokasikan ke ANAGATA-03', time: '1 jam yang lalu', icon: CheckIcon, iconColor: 'text-green-500', isUnread: false },
    { id: 5, title: 'Bahan Bakar Rendah', message: 'Kapal ANAGATA HORIZON bahan bakar tersisa 35%', time: '2 jam yang lalu', icon: ExclamationTriangleIcon, iconColor: 'text-yellow-500', isUnread: true },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0e1017] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1017] text-gray-200 font-mono text-sm selection:bg-purple-500/30 flex flex-col">
      <nav className="w-full bg-[#12111d]/90 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <Image src="/profile/icon.png" alt="Logo" width={30} height={30} className="object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-base tracking-widest leading-tight">
                ANAGATA<br/>OCEANICS
              </h1>
              <p className="text-[9px] text-gray-500 tracking-wider uppercase">Sistem Manajemen Armada</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-xs tracking-wider cursor-pointer ${
                    isActive 
                      ? 'bg-[#b06aee] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] font-bold' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}>
                    <Icon className="w-4 h-4" /> {item.name}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-300">{username}</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
                <span className="text-[10px] text-green-500 tracking-wider">ONLINE</span>
              </div>
            </div>
            
            <div className="h-8 w-[1px] bg-white/10"></div>
            
            <div className="relative">
              <div 
                className="cursor-pointer text-gray-400 hover:text-white transition-colors p-1"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <BellIcon className="w-5 h-5" />
                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm border border-[#12141f]">
                  4
                </div>
              </div>

              {showNotifications && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-[#171b26] border border-white/5 shadow-2xl z-50 cursor-default rounded-md overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-white/5 flex justify-between items-start bg-[#1a1e2a]">
                    <div>
                      <h3 className="text-white font-bold text-sm tracking-wider">Notifikasi</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5 font-mono">4 belum dibaca</p>
                    </div>
                    <button className="text-[10px] text-[#b06aee] hover:text-white transition-colors tracking-wide">
                      Hapus Semua
                    </button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto custom-scrollbar flex flex-col">
                    {notifications.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <div key={notif.id} className="p-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors flex gap-3 relative cursor-pointer">
                          <div className={`mt-0.5 shrink-0 ${notif.iconColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-[11px] font-bold text-gray-200 mb-1">{notif.title}</h4>
                            <p className="text-[10px] text-gray-400 leading-relaxed mb-2 pr-4">{notif.message}</p>
                            <span className="text-[9px] text-gray-600 font-mono">{notif.time}</span>
                          </div>
                          {notif.isUnread && (
                            <div className="absolute right-4 top-5 w-1.5 h-1.5 rounded-full bg-[#b06aee] shadow-[0_0_5px_rgba(176,106,238,0.5)]"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-[1px] bg-white/10"></div>

            
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-rose-400 transition-colors">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1">
        {children}
      </div>

      <footer className="border-t border-white/5 bg-[#0e1017] mt-auto">
        <div className="px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border border-white/10 rounded overflow-hidden flex items-center justify-center opacity-70">
                <Image src="/profile/icon.png" alt="Logo" width={16} height={16} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-300 tracking-wider">ANAGATA OCEANICS</p>
              <p className="text-[9px] text-gray-600">Dashboard Administrator</p>
            </div>
          </div>
          <div className="text-[10px] text-gray-600 space-x-4">
            <span>Sistem Manajemen Armada Laut</span>
            <span>•</span>
            <span>© 2026 Anagata Oceanics</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

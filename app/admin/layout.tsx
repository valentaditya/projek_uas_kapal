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
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
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
        if (user.role !== 'Admin') {
          router.replace('/dashboard');
          return;
        }
        setUsername(user.nama_lengkap || user.username || 'Admin');
        setIsLoading(false);
      } catch (e) {
        router.replace('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {

    document.cookie = "session_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/login');
  };

  const navItems = [
    {
      name: 'Utama',
      icon: Square3Stack3DIcon,
      isMega: true,
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: ShipIcon, desc: 'Ringkasan analitik dan metrik utama' },
        { name: 'Kelola Kapal', href: '/admin/kelola-kapal', icon: AnchorIcon, desc: 'Manajemen armada kapal' },
        { name: 'Analitik', href: '/admin/analitik', icon: AnalyticsIcon, desc: 'Statistik performa dan laporan' },
      ]
    },
    {
      name: 'Operasional',
      icon: MapIcon,
      isMega: true,
      items: [
        { name: 'Peta', href: '/admin/peta', icon: MapIcon, desc: 'Pemantauan lokasi kapal real-time' },
        { name: 'Rute', href: '/admin/rute', icon: RoutePathIcon, desc: 'Manajemen rute pelayaran' },
      ]
    },
    { name: 'Pengiriman', href: '/admin/pengiriman', icon: CubeIcon },
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
            {navItems.map((item) => {
              if (item.isMega && item.items) {
                const Icon = item.icon;
                const isActive = item.items.some(subItem => pathname === subItem.href);
                return (
                  <div key={item.name} className="relative group">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-xs tracking-wider cursor-pointer ${
                      isActive 
                        ? 'bg-[#b06aee] text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] font-bold' 
                        : 'text-gray-400 group-hover:text-white group-hover:bg-white/5'
                    }`}>
                      <Icon className="w-4 h-4" /> 
                      {item.name}
                      <ChevronDownIcon className="w-3 h-3 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                    </div>
                    
                    <div className="absolute top-full left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="bg-[#171b26] border border-white/5 rounded-lg shadow-2xl p-2 overflow-hidden">
                        {item.items.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = pathname === subItem.href;
                          return (
                            <Link key={subItem.name} href={subItem.href}>
                              <div className={`flex items-start gap-3 p-3 rounded-md transition-colors ${
                                isSubActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-gray-400 hover:text-white'
                              }`}>
                                <div className={`mt-0.5 shrink-0 ${isSubActive ? 'text-[#b06aee]' : 'text-gray-500'}`}>
                                  <SubIcon className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className={`text-xs font-bold ${isSubActive ? 'text-white' : 'text-gray-300'}`}>{subItem.name}</div>
                                  <div className="text-[10px] text-gray-500 mt-1">{subItem.desc}</div>
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href || '#'}>
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

          <div className="hidden lg:flex items-center gap-4 text-xs">
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

      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          
          <div className="relative ml-auto w-full max-w-xs h-full bg-[#12111d] border-l border-purple-500/20 p-6 flex flex-col justify-between shadow-2xl z-10 animate-slide-in">
            <div>
              
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 relative flex items-center justify-center">
                    <Image src="/profile/icon.png" alt="Logo" width={24} height={24} className="object-contain" />
                  </div>
                  <div>
                    <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 text-sm tracking-widest leading-tight">
                      ANAGATA
                    </h2>
                    <p className="text-[8px] text-gray-500 tracking-wider uppercase">Menu Admin</p>
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

              
              <div className="py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[#b06aee] font-bold text-xs uppercase">
                    {username.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-200 text-xs">{username}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
                      <span className="text-[9px] text-green-500 tracking-wider uppercase font-semibold">ONLINE</span>
                    </div>
                  </div>
                </div>
              </div>

              
              <div className="py-4 space-y-4 max-h-[45vh] overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                  if (item.isMega && item.items) {
                    const Icon = item.icon;
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest px-2 font-bold flex items-center gap-1.5">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{item.name}</span>
                        </div>
                        <div className="space-y-0.5 pl-2 border-l border-white/5 ml-3">
                          {item.items.map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = pathname === subItem.href;
                            return (
                              <Link 
                                key={subItem.name} 
                                href={subItem.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors text-xs ${
                                  isSubActive 
                                    ? 'bg-[#b06aee]/20 text-white font-bold' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}>
                                  <SubIcon className="w-3.5 h-3.5 shrink-0" />
                                  <span>{subItem.name}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href || '#'}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className={`flex items-center gap-3 px-2 py-2 rounded transition-colors text-xs ${
                        isActive 
                          ? 'bg-[#b06aee]/20 text-white font-bold' 
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}>
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}

                
                <div className="pt-2 border-t border-white/5">
                  <div className="text-[9px] text-gray-500 uppercase tracking-widest px-2 font-bold mb-2 flex justify-between items-center">
                    <span>Notifikasi</span>
                    <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">4</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 px-2 custom-scrollbar">
                    {notifications.slice(0, 3).map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <div key={notif.id} className="p-2 bg-white/[0.02] border border-white/5 rounded text-[10px] flex gap-2">
                          <div className={`shrink-0 mt-0.5 ${notif.iconColor}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-300">{notif.title}</div>
                            <div className="text-gray-500 mt-0.5 leading-tight text-[9px]">{notif.message}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            
            <div className="pt-4 border-t border-white/10">
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors text-xs font-bold font-mono tracking-wider"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span>LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      )}

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

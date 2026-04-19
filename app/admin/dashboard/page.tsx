"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../utils/supabase/client';
import { 
  Square3Stack3DIcon,
  MapIcon, 
  ChartBarIcon, 
  UsersIcon, 
  WrenchScrewdriverIcon, 
  ArrowRightOnRectangleIcon,
  MapPinIcon,
  ClockIcon,
  FireIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
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

export default function DashboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState('Admin Logistik');
  const [isLoading, setIsLoading] = useState(true);

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

  const initialShips = [
    { name: 'ANAGATA PIONEER', type: 'Container', status: 'En Route', kapten: 'Kapten Budi Santoso', tujuan: 'Los Angeles', kecepatan: '17.888882420316165', statusColor: 'text-[#3b82f6]', statusBg: 'bg-[#3b82f6]/10', borderColor: 'border-[#3b82f6]/20' },
    { name: 'ANAGATA OCEAN', type: 'Bulk Carrier', status: 'In Port', kapten: 'Kapten Agus Wijaya', tujuan: 'Singapore', kecepatan: '0', statusColor: 'text-[#10b981]', statusBg: 'bg-[#10b981]/10', borderColor: 'border-[#10b981]/20' },
    { name: 'ANAGATA WAVE', type: 'Tanker', status: 'Delayed', kapten: 'Kapten Andi Pratama', tujuan: 'Sydney', kecepatan: '12.3', statusColor: 'text-[#eab308]', statusBg: 'bg-[#eab308]/10', borderColor: 'border-[#eab308]/20' },
    { name: 'ANAGATA VOYAGER', type: 'Container', status: 'En Route', kapten: 'Kapten Hendra Kusuma', tujuan: 'Rotterdam', kecepatan: '20.61672740950364', statusColor: 'text-[#3b82f6]', statusBg: 'bg-[#3b82f6]/10', borderColor: 'border-[#3b82f6]/20' },
    { name: 'ANAGATA HORIZON', type: 'Ro-Ro', status: 'Maintenance', kapten: 'Kapten Dedi Setiawan', tujuan: 'New York', kecepatan: '0', statusColor: 'text-[#f97316]', statusBg: 'bg-[#f97316]/10', borderColor: 'border-[#f97316]/20' },
    { name: 'ANAGATA NAVIGATOR', type: 'Container', status: 'En Route', kapten: 'Kapten Rudi Hartono', tujuan: 'Hong Kong', kecepatan: '21.19890074439647', statusColor: 'text-[#3b82f6]', statusBg: 'bg-[#3b82f6]/10', borderColor: 'border-[#3b82f6]/20' },
    { name: 'ANAGATA GUARDIAN', type: 'Bulk Carrier', status: 'En Route', kapten: 'Kapten Bambang Suryadi', tujuan: 'Santos', kecepatan: '16.35021022308469', statusColor: 'text-[#3b82f6]', statusBg: 'bg-[#3b82f6]/10', borderColor: 'border-[#3b82f6]/20' },
    { name: 'ANAGATA SENTINEL', type: 'Tanker', status: 'In Port', kapten: 'Kapten Arief Budiman', tujuan: 'Dubai', kecepatan: '0', statusColor: 'text-[#10b981]', statusBg: 'bg-[#10b981]/10', borderColor: 'border-[#10b981]/20' },
  ];

  const availableStatuses = [
    { status: 'En Route', color: 'text-[#3b82f6]', bg: 'bg-[#3b82f6]/10' },
    { status: 'In Port', color: 'text-[#10b981]', bg: 'bg-[#10b981]/10' },
    { status: 'Delayed', color: 'text-[#eab308]', bg: 'bg-[#eab308]/10' },
    { status: 'Maintenance', color: 'text-[#f97316]', bg: 'bg-[#f97316]/10' },
  ];

  const [shipsData, setShipsData] = useState(initialShips);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShipsData(currentData => 
        currentData.map(ship => {
          if (Math.random() > 0.4) return ship;

          const randomStatusObj = availableStatuses[Math.floor(Math.random() * availableStatuses.length)];
          const newStatus = randomStatusObj.status;
          
          let newSpeed = ship.kecepatan;
          if (newStatus === 'In Port' || newStatus === 'Maintenance') {
             newSpeed = '0';
          } else if (newStatus === 'Delayed') {
             newSpeed = (Math.random() * 8 + 4).toFixed(1); 
          } else if (newStatus === 'En Route') {
             newSpeed = (Math.random() * 10 + 15).toFixed(14); 
          }

          return {
            ...ship,
            status: newStatus,
            statusColor: randomStatusObj.color,
            statusBg: randomStatusObj.bg,
            kecepatan: newSpeed
          };
        })
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const totalKapal = shipsData.length;
  const countEnRoute = shipsData.filter(s => s.status === 'En Route').length;
  const countInPort = shipsData.filter(s => s.status === 'In Port').length;
  const countDelayed = shipsData.filter(s => s.status === 'Delayed').length;
  const countMaintenance = shipsData.filter(s => s.status === 'Maintenance').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0e1017] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1017] text-gray-200 font-mono text-sm selection:bg-purple-500/30">
      
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
            <button className="flex items-center gap-2 bg-[#b06aee] text-white px-4 py-2 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)] text-xs font-bold tracking-wider">
              <ShipIcon className="w-4 h-4" /> Dashboard
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <AnchorIcon className="w-4 h-4" /> Kelola Kapal
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <AnalyticsIcon className="w-4 h-4" /> Analitik
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <RoutePathIcon className="w-4 h-4" /> Rute
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <CubeIcon className="w-4 h-4" /> Pengiriman
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <MapIcon className="w-4 h-4" /> Peta
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <UsersIcon className="w-4 h-4" /> Kelola User
            </button>
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
            
            <div className="relative cursor-pointer text-gray-400 hover:text-white transition-colors">
              <BellIcon className="w-5 h-5" />
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white shadow-sm border border-[#12141f]">
                3
              </div>
            </div>

            <div className="h-8 w-[1px] bg-white/10"></div>
            
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-rose-400 transition-colors">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto px-6 py-10 relative z-10 w-full max-w-[1500px]">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Ringkasan Armada</h2>
          <p className="text-gray-400 text-xs tracking-wider">Pemantauan real-time - update setiap 5 detik</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">TOTAL KAPAL</p>
              <p className="text-4xl font-black text-[#b06aee]">{totalKapal}</p>
            </div>
            <div className="w-12 h-12 rounded bg-[#b06aee]/10 flex items-center justify-center">
              <ShipIcon className="w-6 h-6 text-[#b06aee]" />
            </div>
          </div>
          
          <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">EN ROUTE</p>
              <p className="text-4xl font-black text-[#3b82f6]">{countEnRoute}</p>
            </div>
            <div className="w-12 h-12 rounded bg-[#3b82f6]/10 flex items-center justify-center">
              <ArrowTrendingUpIcon className="w-6 h-6 text-[#3b82f6]" />
            </div>
          </div>

          <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">IN PORT</p>
              <p className="text-4xl font-black text-[#06b6d4]">{countInPort}</p>
            </div>
            <div className="w-12 h-12 rounded bg-[#06b6d4]/10 flex items-center justify-center">
              <AnchorIcon className="w-6 h-6 text-[#06b6d4]" />
            </div>
          </div>

          <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">DELAYED</p>
              <p className="text-4xl font-black text-[#eab308]">{countDelayed}</p>
            </div>
            <div className="w-12 h-12 rounded bg-[#eab308]/10 flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-[#eab308]" />
            </div>
          </div>

          <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">MAINTENANCE</p>
              <p className="text-4xl font-black text-[#f97316]">{countMaintenance}</p>
            </div>
            <div className="w-12 h-12 rounded bg-[#f97316]/10 flex items-center justify-center">
              <WrenchScrewdriverIcon className="w-6 h-6 text-[#f97316]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {shipsData.map((ship, idx) => (
            <div key={idx} className="bg-[#151922] border border-white/5 rounded-[10px] p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#b06aee]/10 flex items-center justify-center border border-[#b06aee]/20 shrink-0">
                    <ShipIcon className="w-4 h-4 text-[#b06aee]" />
                  </div>
                  <div>
                    <h3 className="text-gray-200 font-bold tracking-wide text-xs">{ship.name}</h3>
                    <p className="text-[10px] text-gray-500">{ship.type}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-semibold flex-shrink-0 ${ship.statusBg} ${ship.statusColor}`}>
                  {ship.status}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <span>Kapten:</span>
                  <span className="text-gray-200 font-mono tracking-tight font-medium text-right max-w-[130px] truncate">{ship.kapten}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <MapPinIcon className="w-3.5 h-3.5 shrink-0" /> 
                  <span className="text-gray-200 font-mono tracking-tight font-medium">{ship.tujuan}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <div className="flex items-center gap-2">
                    <BoltIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Kecepatan:</span>
                  </div>
                  <span className="text-gray-200 font-mono tracking-tight font-medium">{ship.kecepatan} kn</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

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

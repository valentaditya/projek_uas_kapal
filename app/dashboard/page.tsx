"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
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
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState('SEMUA');
  const [username, setUsername] = useState('Admin Logistik');

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata?.username) {
        setUsername(user.user_metadata.username);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const ships = [
    { name: 'ANAGATA PIONEER', type: 'Container', status: 'BERLAYAR', tujuan: 'Los Angeles', eta: '2026-04-18 14:30', kecepatan: '17.9 kts', fuel: 75.80861218798037, statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { name: 'ANAGATA OCEAN', type: 'Bulk Carrier', status: 'DI PELABUHAN', tujuan: 'Singapore', eta: '2026-04-13 08:00', kecepatan: '0.0 kts', fuel: 45.0, statusColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { name: 'ANAGATA WAVE', type: 'Tanker', status: 'TERTUNDA', tujuan: 'Sydney', eta: '2026-04-15 22:00', kecepatan: '12.3 kts', fuel: 62.0, statusColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { name: 'ANAGATA VOYAGER', type: 'Container', status: 'BERLAYAR', tujuan: 'Rotterdam', eta: '2026-04-16 10:30', kecepatan: '19.3 kts', fuel: 82.70265821476094, statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { name: 'ANAGATA HORIZON', type: 'Ro-Ro', status: 'PEMELIHARAAN', tujuan: 'New York', eta: '2026-04-20 16:00', kecepatan: '0.0 kts', fuel: 35.0, statusColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { name: 'ANAGATA NAVIGATOR', type: 'Container', status: 'BERLAYAR', tujuan: 'Hong Kong', eta: '2026-04-14 19:45', kecepatan: '20.1 kts', fuel: 69.32505560241174, statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { name: 'ANAGATA GUARDIAN', type: 'Bulk Carrier', status: 'BERLAYAR', tujuan: 'Santos', eta: '2026-04-17 11:20', kecepatan: '15.3 kts', fuel: 65.63021067645452, statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { name: 'ANAGATA SENTINEL', type: 'Tanker', status: 'DI PELABUHAN', tujuan: 'Dubai', eta: '2026-04-13 06:00', kecepatan: '0.0 kts', fuel: 52.0, statusColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  ];

  const filteredShips = filterStatus === 'SEMUA' ? ships : ships.filter(s => s.status === filterStatus);

  const counts = {
    SEMUA: ships.length,
    BERLAYAR: ships.filter(s => s.status === 'BERLAYAR').length,
    DI_PELABUHAN: ships.filter(s => s.status === 'DI PELABUHAN').length,
    TERTUNDA: ships.filter(s => s.status === 'TERTUNDA').length,
    PEMELIHARAAN: ships.filter(s => s.status === 'PEMELIHARAAN').length,
  };

  const logs = [
    { title: 'Speed adjustment', vessel: 'V006', detail: 'Position: 22.30, 114.15  Speed: 20.1 kts  Fuel: 69.32%', time: '21:04:56' },
    { title: 'Navigation check', vessel: 'V004', detail: 'Position: 51.51, -0.26  Speed: 20.0 kts  Fuel: 82.89%', time: '21:04:51' },
    { title: 'Position update', vessel: 'V007', detail: 'Position: -23.61, -46.69  Speed: 15.5 kts  Fuel: 66.80%', time: '21:04:51' },
    { title: 'Course maintained', vessel: 'V006', detail: 'Position: 22.31, 114.11  Speed: 18.9 kts  Fuel: 70.62%', time: '21:04:36' },
    { title: 'Position update', vessel: 'V012', detail: 'Position: -15.42, 33.11  Speed: 12.0 kts  Fuel: 42.10%', time: '21:04:36' },
  ];

  const getFuelColor = (fuel: number) => {
    if (fuel > 60) return 'bg-green-500';
    if (fuel > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-[#0a0614] text-gray-200 font-mono text-sm selection:bg-purple-500/30 relative overflow-x-hidden">
      {/* Background glow effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[300px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* NAVBAR */}
      <nav className="w-full bg-[#12111d]/90 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Title */}
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

          {/* Nav Menus */}
          <div className="hidden lg:flex items-center gap-2">
            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)] text-xs font-bold tracking-wider">
              <Square3Stack3DIcon className="w-4 h-4" /> Armada
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <DocumentTextIcon className="w-4 h-4" /> Pengiriman
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <MapIcon className="w-4 h-4" /> Peta
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <ChartBarIcon className="w-4 h-4" /> Analitik
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <UsersIcon className="w-4 h-4" /> Kelola User
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <WrenchScrewdriverIcon className="w-4 h-4" /> Kelola Kapal
            </button>
          </div>

          {/* User / Actions */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex flex-col items-end">
              <span className="font-bold text-gray-300">{username}</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></div>
                <span className="text-[10px] text-green-500 tracking-wider">ONLINE</span>
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

      {/* MAIN CONTENT */}
      <main className="max-w-[1400px] mx-auto px-6 py-8 relative z-10">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-widest text-white mb-2">Ringkasan Armada</h2>
          <p className="text-gray-400 text-xs tracking-wider">Pemantauan real-time semua kapal - diperbarui setiap 5 detik</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#12111d]/80 backdrop-blur-sm border border-purple-500/20 rounded-lg p-5 flex items-center justify-between shadow-[0_0_20px_rgba(168,85,247,0.05)]">
            <div>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-1">TOTAL KAPAL</p>
              <p className="text-3xl font-black text-purple-400">8</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Square3Stack3DIcon className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="bg-[#12111d]/80 backdrop-blur-sm border border-blue-500/20 rounded-lg p-5 flex items-center justify-between shadow-[0_0_20px_rgba(59,130,246,0.05)]">
            <div>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-1">SEDANG BERLAYAR</p>
              <p className="text-3xl font-black text-blue-400">4</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <PaperAirplaneIcon className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="bg-[#12111d]/80 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-5 flex items-center justify-between shadow-[0_0_20px_rgba(34,211,238,0.05)]">
            <div>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-1">DI PELABUHAN</p>
              <p className="text-3xl font-black text-cyan-400">2</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <MapPinIcon className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div className="bg-[#12111d]/80 backdrop-blur-sm border border-yellow-500/20 rounded-lg p-5 flex items-center justify-between shadow-[0_0_20px_rgba(234,179,8,0.05)]">
            <div>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest mb-1">PERINGATAN</p>
              <p className="text-3xl font-black text-yellow-400">2</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6 text-[10px] font-bold tracking-widest">
          <button onClick={() => setFilterStatus('SEMUA')} className={`${filterStatus === 'SEMUA' ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-[#181625] text-gray-400 hover:bg-[#201d32] border border-white/5'} px-4 py-2 rounded-md transition-colors`}>SEMUA ({counts.SEMUA})</button>
          <button onClick={() => setFilterStatus('BERLAYAR')} className={`${filterStatus === 'BERLAYAR' ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-[#181625] text-gray-400 hover:bg-[#201d32] border border-white/5'} px-4 py-2 rounded-md transition-colors`}>BERLAYAR ({counts.BERLAYAR})</button>
          <button onClick={() => setFilterStatus('DI PELABUHAN')} className={`${filterStatus === 'DI PELABUHAN' ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-[#181625] text-gray-400 hover:bg-[#201d32] border border-white/5'} px-4 py-2 rounded-md transition-colors`}>DI PELABUHAN ({counts.DI_PELABUHAN})</button>
          <button onClick={() => setFilterStatus('TERTUNDA')} className={`${filterStatus === 'TERTUNDA' ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-[#181625] text-gray-400 hover:bg-[#201d32] border border-white/5'} px-4 py-2 rounded-md transition-colors`}>TERTUNDA ({counts.TERTUNDA})</button>
          <button onClick={() => setFilterStatus('PEMELIHARAAN')} className={`${filterStatus === 'PEMELIHARAAN' ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-[#181625] text-gray-400 hover:bg-[#201d32] border border-white/5'} px-4 py-2 rounded-md transition-colors`}>PEMELIHARAAN ({counts.PEMELIHARAAN})</button>
        </div>

        {/* Ships Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">
          {filteredShips.map((ship, idx) => (
            <div key={idx} className="bg-[#12111d]/60 backdrop-blur-sm border border-white/5 hover:border-purple-500/30 transition-colors rounded-lg p-5">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-gray-200 font-bold tracking-widest text-lg">{ship.name}</h3>
                  <p className="text-xs text-gray-500">{ship.type}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold border ${ship.statusColor}`}>
                  {ship.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-xs mb-2">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-gray-500 text-[10px] tracking-wide mb-0.5">Tujuan</div>
                    <div className="text-gray-200 font-mono tracking-tight text-xs">{ship.tujuan}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ClockIcon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-gray-500 text-[10px] tracking-wide mb-0.5">ETA</div>
                    <div className="text-gray-200 font-mono tracking-tight text-xs">{ship.eta}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <PaperAirplaneIcon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-gray-500 text-[10px] tracking-wide mb-0.5">Kecepatan</div>
                    <div className="text-gray-200 font-mono tracking-tight text-xs">{ship.kecepatan}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FireIcon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                  <div>
                    <div className="text-gray-500 text-[10px] tracking-wide mb-0.5">Bahan Bakar</div>
                    <div className="text-gray-200 font-mono tracking-tight text-xs">{ship.fuel}%</div>
                  </div>
                </div>
              </div>

              {/* Full Width Progress Bar */}
              <div className="w-full h-[5px] bg-gray-800 rounded-full overflow-hidden mt-6">
                <div className={`h-full rounded-full ${getFuelColor(ship.fuel)}`} style={{ width: `${ship.fuel}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Activity Logs */}
        <div className="bg-[#12111d]/60 backdrop-blur-sm border border-white/5 rounded-lg p-5 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <InformationCircleIcon className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-bold tracking-widest text-sm">VESSEL ACTIVITY LOGS</h3>
          </div>
          
          <div className="space-y-3">
            {logs.map((log, idx) => (
              <div key={idx} className="bg-[#181625]/50 border border-white/5 rounded-md p-4 flex items-start gap-4 hover:bg-[#181625] transition-colors">
                <InformationCircleIcon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-gray-200 font-bold mb-1 text-xs">{log.title}</h4>
                  <p className="text-[10px] text-gray-400 mb-1">Vessel: {log.vessel}</p>
                  <p className="text-[10px] text-gray-500">{log.detail}</p>
                </div>
                <div className="text-[10px] text-gray-500">{log.time}</div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0614] mt-auto">
        <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Image src="/profile/icon.png" alt="Logo" width={24} height={24} className="opacity-50" />
            <div>
              <p className="text-xs font-bold text-gray-400 tracking-wider">ANAGATA OCEANICS</p>
              <p className="text-[10px] text-gray-600">Dashboard Administrator</p>
            </div>
          </div>
          <div className="text-[10px] text-gray-600 space-x-2">
            <span>Sistem Manajemen Armada Laut</span>
            <span>•</span>
            <span>© 2026 Anagata Oceanics</span>
            <span>•</span>
            <span>Hak Cipta Dilindungi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

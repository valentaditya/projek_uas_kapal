"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase/client';
import { 
  MagnifyingGlassIcon,
  CubeIcon,
  ClockIcon,
  CheckBadgeIcon,
  MapPinIcon,
  CalendarIcon,
  PaperAirplaneIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function UserDashboard() {
  const router = useRouter();
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

  const stats = {
    total: 5,
    transit: 2,
    tunggu: 3,
    selesai: 0
  };

  const shipments = [
    {
      id: "AO-2026-001",
      status: "Dalam Perjalanan",
      statusColor: "text-[#06b6d4]",
      statusBg: "bg-[#06b6d4]/10",
      type: "Container",
      pengirim: "PT Maju Jaya",
      asal: "Jakarta, Indonesia",
      tujuan: "Singapore",
      tanggal: "10/4/2026",
      biaya: "Rp 2.500.000",
      details: "20ft Container - Electronics",
      weight: "15 ton",
      volume: "33 m³",
      progress: "Dalam perjalanan - V002(ETA: 15/4/2026)",
      catatan: "Fragile items - handle with care",
      borderColor: "border-[#06b6d4]/30"
    },
    {
      id: "AO-2026-002",
      status: "Disetujui",
      statusColor: "text-[#3b82f6]",
      statusBg: "bg-[#3b82f6]/10",
      type: "Kargo Curah",
      pengirim: "CV Sejahtera",
      asal: "Surabaya, Indonesia",
      tujuan: "Sydney, Australia",
      tanggal: "12/4/2026",
      biaya: "Rp 125.000.000",
      details: "Bulk Grain",
      weight: "50 ton",
      volume: "60 m³",
      progress: "Menunggu Penjadwalan Kapal",
      catatan: "Standard handling",
      borderColor: "border-[#3b82f6]/30"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0e1017] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#b06aee]/30 border-t-[#b06aee] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e1017] text-gray-200 font-mono text-sm selection:bg-purple-500/30">
      
      {/* NAVBAR */}
      <nav className="w-full bg-[#12111d]/90 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-[1500px] mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo & Title */}
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

          {/* Nav Menus */}
          <div className="hidden lg:flex items-center gap-2">
            <button className="flex items-center gap-2 bg-[#b06aee] text-white px-5 py-2 rounded shadow-[0_0_15px_rgba(168,85,247,0.4)] text-xs font-bold tracking-wider">
              <CubeIcon className="w-4 h-4" /> Pelacakan
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <PaperAirplaneIcon className="w-4 h-4" /> Kirim Paket
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white px-4 py-2 rounded-md hover:bg-white/5 transition-colors text-xs tracking-wider">
              <UserIcon className="w-4 h-4" /> Profil
            </button>
          </div>

          {/* User / Actions */}
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

      <main className="max-w-[1200px] mx-auto px-6 py-8 relative z-10 w-full space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-[#1a1625] border border-purple-500/20 rounded-lg p-6">
          <h2 className="text-xl font-bold tracking-wider text-white mb-1">Selamat Datang, {username}</h2>
          <p className="text-gray-400 text-xs tracking-wider">Lacak status pengiriman barang Anda secara real-time</p>
        </div>

        {/* Tracking Input */}
        <div className="bg-[#151922] border border-white/5 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3 text-gray-300 text-sm font-semibold">
            <MagnifyingGlassIcon className="w-4 h-4 text-[#b06aee]" />
            Tracking Pengiriman
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
            </div>
            <input 
              type="text" 
              className="w-full bg-[#0e1017] border border-white/10 rounded px-10 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors placeholder-gray-600"
              placeholder="Masukkan nomor tracking (contoh: AO-2026-001) atau nama..."
            />
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#151922] border border-white/5 rounded-lg p-5 flex flex-col gap-1 justify-center relative overflow-hidden">
            <div className="flex flex-col gap-1 z-10">
              <div className="text-[11px] text-gray-500 tracking-widest font-semibold uppercase flex items-center gap-2">
                <CubeIcon className="w-4 h-4 text-gray-400" /> Total
              </div>
              <p className="text-2xl font-black text-white">{stats.total}</p>
            </div>
          </div>

          <div className="bg-[#151922] border border-white/5 rounded-lg p-5 flex flex-col gap-1 justify-center relative overflow-hidden">
            <div className="flex flex-col gap-1 z-10">
              <div className="text-[11px] text-gray-500 tracking-widest font-semibold uppercase flex items-center gap-2">
                <PaperAirplaneIcon className="w-4 h-4 text-[#3b82f6]" /> Transit
              </div>
              <p className="text-2xl font-black text-white">{stats.transit}</p>
            </div>
          </div>

          <div className="bg-[#151922] border border-white/5 rounded-lg p-5 flex flex-col gap-1 justify-center relative overflow-hidden">
            <div className="flex flex-col gap-1 z-10">
              <div className="text-[11px] text-gray-500 tracking-widest font-semibold uppercase flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-[#eab308]" /> Tunggu
              </div>
              <p className="text-2xl font-black text-white">{stats.tunggu}</p>
            </div>
          </div>

          <div className="bg-[#151922] border border-white/5 rounded-lg p-5 flex flex-col gap-1 justify-center relative overflow-hidden">
            <div className="flex flex-col gap-1 z-10">
              <div className="text-[11px] text-gray-500 tracking-widest font-semibold uppercase flex items-center gap-2">
                <CheckBadgeIcon className="w-4 h-4 text-[#10b981]" /> Selesai
              </div>
              <p className="text-2xl font-black text-white">{stats.selesai}</p>
            </div>
          </div>
        </div>

        <h3 className="text-white font-bold tracking-wider mt-8">Semua Pengiriman</h3>

        <div className="space-y-4">
          {shipments.map((item, idx) => (
            <div key={idx} className={`bg-[#151922] border ${item.borderColor} border-opacity-50 rounded-lg p-6 relative`}>
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-200">{item.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${item.statusBg} ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-semibold mb-1">Total Biaya</p>
                  <p className="text-[#b06aee] font-mono opacity-90">{item.biaya}</p>
                </div>
              </div>

              {/* Sender Details */}
              <div className="bg-[#0e1017]/50 rounded p-4 border border-white/5 mb-4">
                 <p className="text-[10px] text-gray-500 mb-1">Pengirim</p>
                 <p className="text-xs text-gray-300 font-semibold">{item.pengirim}</p>
              </div>

              {/* Grid 3 Columns: Asal, Tujuan, Tanggal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 border-b border-white/5 pb-5">
                 <div>
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Asal</span>
                    </div>
                    <p className="text-xs text-gray-300 ml-5 font-semibold">{item.asal}</p>
                 </div>
                 <div>
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      <MapPinIcon className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-[10px]">Tujuan</span>
                    </div>
                    <p className="text-xs text-gray-300 ml-5 font-semibold">{item.tujuan}</p>
                 </div>
                 <div>
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Tanggal</span>
                    </div>
                    <p className="text-xs text-gray-300 ml-5 font-semibold">{item.tanggal}</p>
                 </div>
              </div>

              {/* Main Goods Details */}
              <div className="mb-4">
                 <p className="text-xs font-semibold text-gray-300">{item.details}</p>
                 <p className="text-[11px] text-gray-500">Berat: {item.weight} &nbsp;|&nbsp; Volume: {item.volume}</p>
              </div>
              
              {/* Progress & Note */}
              <div className="space-y-3">
                 <div className={`flex items-center gap-2 text-xs font-semibold ${item.statusColor}`}>
                    <InformationCircleIcon className="w-4 h-4" />
                    <span>{item.progress}</span>
                 </div>
                 <div className="text-[10px] text-gray-500">
                   <span className="text-gray-400">Catatan:</span> {item.catatan}
                 </div>
              </div>

            </div>
          ))}
        </div>

      </main>

    </div>
  );
}

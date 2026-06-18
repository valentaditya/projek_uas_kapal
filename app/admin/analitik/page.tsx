"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowTrendingUpIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { 
  StatusDistribusiChart, 
  RegionalDistribusiChart, 
  FuelLevelChart, 
  KecepatanChart 
} from './AnalitikCharts';
import { createClient } from '@/utils/supabase/client';

// cara connect db
const supabase = createClient();

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

export default function AnalitikPage() {
  const [shipsData, setShipsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShips = async () => {
    try {
      const { data, error } = await // cara ambil data di db
 supabase.from('kapal').select('*');
      if (data && !error) {
        const getIndonesianStatus = (status: string) => {
          const s = (status || '').toLowerCase();
          if (s.includes('route') || s.includes('berlayar')) return 'Sedang Berlayar';
          if (s.includes('port') || s.includes('pelabuhan')) return 'Di Pelabuhan';
          if (s.includes('delay') || s.includes('tunda')) return 'Tertunda';
          if (s.includes('maintenance') || s.includes('pelihara') || s.includes('perbaikan')) return 'Pemeliharaan';
          return status;
        };
        const mapped = data.map((ship: any) => {
          const rawStatus = ship.status_kapal || 'En Route';
          const isBerlayar = rawStatus.toLowerCase().includes('route') || rawStatus.toLowerCase().includes('berlayar');
          return {
            name: ship.nama_kapal,
            type: ship.tipe_kapal,
            status: getIndonesianStatus(rawStatus),
            kapten: ship.nama_kapten,
            tujuan: ship.tujuan_kapal,
            kecepatan: isBerlayar ? (15 + Math.random() * 5).toFixed(1) : '0',
            fuel: ship.fuel_kapal,
            region: ship.region_kapal
          };
        });
        setShipsData(mapped);
      }
    } catch (err) {
      console.error('Error fetching ships:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShips();
  }, []);

  const totalKapal = shipsData.length;
  const countEnRoute = shipsData.filter(s => s.status === 'En Route' || s.status === 'Sedang Berlayar').length;
  const countInPort = shipsData.filter(s => s.status === 'In Port' || s.status === 'Di Pelabuhan').length;
  const countDelayed = shipsData.filter(s => s.status === 'Delayed' || s.status === 'Tertunda').length;
  const countMaintenance = shipsData.filter(s => s.status === 'Maintenance' || s.status === 'Pemeliharaan').length;

  return (
    <main className="mx-auto px-6 py-10 relative z-10 w-full max-w-[1500px]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Analitik Armada</h2>
        <p className="text-gray-400 text-xs tracking-wider">Metrik performa dan wawasan operasional</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">TOTAL KAPAL</p>
            {loading ? (
              <div className="h-9 w-14 bg-white/5 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-4xl font-black text-[#b06aee]">{totalKapal}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded bg-[#b06aee]/10 flex items-center justify-center border border-[#b06aee]/20">
            <ShipIcon className="w-6 h-6 text-[#b06aee]" />
          </div>
        </div>
        
        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">SEDANG BERLAYAR</p>
            {loading ? (
              <div className="h-9 w-14 bg-white/5 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-4xl font-black text-[#3b82f6]">{countEnRoute}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded bg-[#3b82f6]/10 flex items-center justify-center border border-[#3b82f6]/20">
            <ArrowTrendingUpIcon className="w-6 h-6 text-[#3b82f6]" />
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">DI PELABUHAN</p>
            {loading ? (
              <div className="h-9 w-14 bg-white/5 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-4xl font-black text-[#06b6d4]">{countInPort}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded bg-[#06b6d4]/10 flex items-center justify-center border border-[#06b6d4]/20">
            <AnchorIcon className="w-6 h-6 text-[#06b6d4]" />
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">TERTUNDA</p>
            {loading ? (
              <div className="h-9 w-14 bg-white/5 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-4xl font-black text-[#eab308]">{countDelayed}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded bg-[#eab308]/10 flex items-center justify-center border border-[#eab308]/20">
            <ClockIcon className="w-6 h-6 text-[#eab308]" />
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">PEMELIHARAAN</p>
            {loading ? (
              <div className="h-9 w-14 bg-white/5 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-4xl font-black text-[#f97316]">{countMaintenance}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded bg-[#f97316]/10 flex items-center justify-center border border-[#f97316]/20">
            <WrenchScrewdriverIcon className="w-6 h-6 text-[#f97316]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
        
        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-6 shadow-lg h-[400px] flex flex-col">
          <h3 className="text-[11px] font-bold text-gray-300 tracking-wider mb-6">DISTRIBUSI STATUS ARMADA</h3>
          <div className="flex-1 relative">
            <StatusDistribusiChart ships={shipsData} />
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-6 shadow-lg h-[400px] flex flex-col">
          <h3 className="text-[11px] font-bold text-gray-300 tracking-wider mb-6">DISTRIBUSI REGIONAL</h3>
          <div className="flex-1 relative">
            <RegionalDistribusiChart ships={shipsData} />
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-6 shadow-lg h-[400px] flex flex-col">
          <h3 className="text-[11px] font-bold text-gray-300 tracking-wider mb-6">LEVEL BAHAN BAKAR PER KAPAL</h3>
          <div className="flex-1 relative">
            <FuelLevelChart ships={shipsData} />
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-6 shadow-lg h-[400px] flex flex-col">
          <h3 className="text-[11px] font-bold text-gray-300 tracking-wider mb-6">KECEPATAN SAAT INI (BERLAYAR)</h3>
          <div className="flex-1 relative">
             <KecepatanChart ships={shipsData} />
          </div>
        </div>

      </div>
    </main>
  );
}

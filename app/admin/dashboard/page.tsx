"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowTrendingUpIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';

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

export default function DashboardPage() {
  const [shipsData, setShipsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // cara connect db
  const supabase = createClient();

  useEffect(() => {
    const fetchKapal = async () => {
      try {
        const { data, error } = await // cara ambil data di db
 supabase.from('kapal').select('*');

        if (data && !error) {
          const formattedData = data.map(ship => {
            let statusColor = 'text-[#3b82f6]'; 
            let statusBg = 'bg-[#3b82f6]/10';   
            
            if (ship.status_kapal === 'En Route') { statusColor = 'text-[#3b82f6]'; statusBg = 'bg-[#3b82f6]/10'; }
            else if (ship.status_kapal === 'In Port') { statusColor = 'text-[#10b981]'; statusBg = 'bg-[#10b981]/10'; }
            else if (ship.status_kapal === 'Delayed') { statusColor = 'text-[#eab308]'; statusBg = 'bg-[#eab308]/10'; }
            else if (ship.status_kapal === 'Maintenance') { statusColor = 'text-[#f97316]'; statusBg = 'bg-[#f97316]/10'; }

            return {
              ...ship,
              statusColor,
              statusBg
            };
          });
          setShipsData(formattedData);
        }
      } catch (e) {
        console.error("Failed to fetch kapal:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchKapal();

    const intervalId = setInterval(() => {
      fetchKapal();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [supabase]);

  const getIndonesianStatus = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('route') || s.includes('berlayar')) return 'Sedang Berlayar';
    if (s.includes('port') || s.includes('pelabuhan')) return 'Di Pelabuhan';
    if (s.includes('delay') || s.includes('tunda')) return 'Tertunda';
    if (s.includes('maintenance') || s.includes('pelihara') || s.includes('perbaikan')) return 'Pemeliharaan';
    return status;
  };

  const totalKapal = shipsData.length;
  const countEnRoute = shipsData.filter(s => s.status_kapal === 'En Route' || s.status_kapal === 'Sedang Berlayar').length;
  const countInPort = shipsData.filter(s => s.status_kapal === 'In Port' || s.status_kapal === 'Di Pelabuhan').length;
  const countDelayed = shipsData.filter(s => s.status_kapal === 'Delayed' || s.status_kapal === 'Tertunda').length;
  const countMaintenance = shipsData.filter(s => s.status_kapal === 'Maintenance' || s.status_kapal === 'Pemeliharaan').length;

  return (
    <main className="mx-auto px-6 py-10 relative z-10 w-full max-w-[1500px]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Ringkasan Armada</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">TOTAL KAPAL</p>
            {loading ? (
              <div className="h-9 w-12 bg-white/5 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-4xl font-black text-[#b06aee]">{totalKapal}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded bg-[#b06aee]/10 flex items-center justify-center">
            <ShipIcon className="w-6 h-6 text-[#b06aee]" />
          </div>
        </div>
        
        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">SEDANG BERLAYAR</p>
            {loading ? (
              <div className="h-9 w-12 bg-white/5 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-4xl font-black text-[#3b82f6]">{countEnRoute}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded bg-[#3b82f6]/10 flex items-center justify-center">
            <ArrowTrendingUpIcon className="w-6 h-6 text-[#3b82f6]" />
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">DI PELABUHAN</p>
            {loading ? (
              <div className="h-9 w-12 bg-white/5 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-4xl font-black text-[#06b6d4]">{countInPort}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded bg-[#06b6d4]/10 flex items-center justify-center">
            <AnchorIcon className="w-6 h-6 text-[#06b6d4]" />
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">TERTUNDA</p>
            {loading ? (
              <div className="h-9 w-12 bg-white/5 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-4xl font-black text-[#eab308]">{countDelayed}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded bg-[#eab308]/10 flex items-center justify-center">
            <ClockIcon className="w-6 h-6 text-[#eab308]" />
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">PEMELIHARAAN</p>
            {loading ? (
              <div className="h-9 w-12 bg-white/5 animate-pulse rounded mt-1" />
            ) : (
              <p className="text-4xl font-black text-[#f97316]">{countMaintenance}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded bg-[#f97316]/10 flex items-center justify-center">
            <WrenchScrewdriverIcon className="w-6 h-6 text-[#f97316]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-[#151922] border border-white/5 rounded-[10px] p-6 flex flex-col justify-between h-[180px]">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-white/5 animate-pulse border border-white/5 shrink-0" />
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-white/5 animate-pulse rounded" />
                    <div className="w-20 h-3 bg-white/5 animate-pulse rounded" />
                  </div>
                </div>
                <div className="w-20 h-5 bg-white/5 animate-pulse rounded" />
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-3 bg-white/5 animate-pulse rounded" />
                  <div className="w-24 h-3 bg-white/5 animate-pulse rounded" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-16 h-3 bg-white/5 animate-pulse rounded" />
                  <div className="w-32 h-3 bg-white/5 animate-pulse rounded" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-10 h-3 bg-white/5 animate-pulse rounded" />
                  <div className="w-16 h-3 bg-white/5 animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))
        ) : (
          shipsData.map((ship, idx) => (
            <div key={idx} className="bg-[#151922] border border-white/5 rounded-[10px] p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#b06aee]/10 flex items-center justify-center border border-[#b06aee]/20 shrink-0">
                    <ShipIcon className="w-4 h-4 text-[#b06aee]" />
                  </div>
                  <div>
                    <h3 className="text-gray-200 font-bold tracking-wide text-xs">{ship.nama_kapal}</h3>
                    <p className="text-[10px] text-gray-500">{ship.tipe_kapal}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-semibold flex-shrink-0 ${ship.statusBg} ${ship.statusColor}`}>
                  {getIndonesianStatus(ship.status_kapal)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <span>Kapten:</span>
                  <span className="text-gray-200 font-mono tracking-tight font-medium text-right max-w-[130px] truncate">{ship.nama_kapten}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <MapPinIcon className="w-3.5 h-3.5 shrink-0" /> 
                  <span className="text-gray-200 font-mono tracking-tight font-medium">{ship.tujuan_kapal}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <div className="flex items-center gap-2">
                    <BoltIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>Bahan Bakar:</span>
                  </div>
                  <span className="text-gray-200 font-mono tracking-tight font-medium">{ship.fuel_kapal ?? 0} %</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

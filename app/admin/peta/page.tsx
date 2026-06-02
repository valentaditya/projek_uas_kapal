"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  XMarkIcon,
  MapIcon,
  PaperAirplaneIcon,
  ClockIcon,
  BoltIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';

const PetaMap = dynamic(() => import('./PetaMap'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 w-full h-full bg-[#0a0d14] flex items-center justify-center animate-pulse"><span className="text-gray-500 font-mono text-sm">Loading Map...</span></div>
});

const PORT_COORDINATES: Record<string, [number, number]> = {
  'jakarta': [-6.1320, 106.8715],
  'tanjung priok': [-6.1320, 106.8715],
  'surabaya': [-7.2052, 112.7366],
  'tanjung perak': [-7.2052, 112.7366],
  'medan': [3.7845, 98.6917],
  'belawan': [3.7845, 98.6917],
  'makassar': [-5.1476, 119.4327],
  'sulawesi selatan': [-5.1476, 119.4327],
  'bali': [-8.7456, 115.2155],
  'benoa': [-8.7456, 115.2155],
  'los angeles': [34.0522, -118.2437],
  'singapore': [1.2902, 103.8519],
  'sydney': [-33.8688, 151.2093],
  'rotterdam': [51.9225, 4.47917],
  'new york': [40.7128, -74.0060],
  'hong kong': [22.3193, 114.1694],
  'santos': [-23.9618, -46.3322],
  'dubai': [25.2048, 55.2708]
};

const getPortCoordinates = (portName: string): [number, number] => {
  if (!portName) return [0, 0];
  const lower = portName.toLowerCase();
  for (const [key, coords] of Object.entries(PORT_COORDINATES)) {
    if (lower.includes(key)) {
      return coords;
    }
  }
  return [-2.5489, 118.0149];
};

export default function PetaGlobalPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRouteName, setSelectedRouteName] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoutesAndShipments = async () => {
      try {
        // cara connect db
        const supabase = createClient();
        const { data, error } = await // cara ambil data di db
 supabase.from('pengiriman').select('*, detail_barang(*)');

        if (error) throw error;

        if (data) {

          const shippedItems = data.filter((s: any) => s.status === 'Kirim' || s.status === 'Dalam Perjalanan');


          const chunks: any[][] = [];
          for (let i = 0; i < shippedItems.length; i += 5) {
            const chunk = shippedItems.slice(i, i + 5);
            if (chunk.length === 5) {
              chunks.push(chunk);
            }
          }

          const vesselNames = [
            'ANAGATA PIONEER',
            'ANAGATA OCEAN',
            'ANAGATA WAVE',
            'ANAGATA VOYAGER',
            'ANAGATA HORIZON',
            'ANAGATA NAVIGATOR',
            'ANAGATA GUARDIAN',
            'ANAGATA SENTINEL'
          ];

          const mappedRoutes = chunks.map((chunk, idx) => {
            const routeId = `R-${String(idx + 1).padStart(3, '0')}`;
            const shipName = vesselNames[idx % vesselNames.length];
            const firstShipment = chunk[0];
            const originPort = firstShipment.pelabuhan_asal || 'Unknown Port';
            const destPort = firstShipment.pelabuhan_tujuan || 'Unknown Port';

            const originCoords = getPortCoordinates(originPort);
            const destCoords = getPortCoordinates(destPort);

            return {
              name: shipName,
              routeId,
              origin: originPort,
              destination: destPort,
              originCoords,
              destCoords,
              status: 'En Route',
              type: 'Container',
              kecepatan: (15 + Math.random() * 5).toFixed(1),
              eta: '2026-06-10 12:00',
              fuel: 85 - idx * 5,
              shipments: chunk
            };
          });

          setRoutes(mappedRoutes);
        }
      } catch (err) {
        console.error('Error loading peta routes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutesAndShipments();
  }, []);

  const selectedRoute = routes.find(r => r.name === selectedRouteName);

  return (
    <main className="mx-auto px-6 py-10 relative z-10 w-full max-w-[1500px]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Tampilan Peta Global</h2>
        <p className="text-gray-400 text-xs tracking-wider">Posisi kapal dan rute pengiriman real-time</p>
      </div>

      <div className="bg-[#10131a] border border-white/5 rounded-t-[10px] p-0 relative shadow-lg overflow-hidden flex flex-col h-[500px]">
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
          <h3 className="text-xs font-bold text-gray-300 tracking-widest uppercase bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded border border-white/10">GLOBAL FLEET MAP</h3>
          <p className="text-[10px] text-gray-400 font-mono flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded border border-white/10">
            <MapIcon className="w-4 h-4" /> {routes.length} routes active
          </p>
        </div>

        <div className="flex-1 relative border border-white/5 bg-[#0a0d14] overflow-hidden">
          {!loading && (
            <PetaMap routes={routes} onRouteClick={(name) => setSelectedRouteName(name)} />
          )}

          <div className="absolute bottom-4 right-4 border border-white/10 bg-[#151922]/90 backdrop-blur-md p-4 rounded text-[10px] w-40 z-10 shadow-xl pointer-events-none">
            <h4 className="font-bold text-gray-300 tracking-wider mb-3">PETA ELEMEN</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                <span className="text-gray-400">Pelabuhan Asal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.8)]"></div>
                <span className="text-gray-400">Pelabuhan Tujuan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 border-t-2 border-dashed border-[#b06aee]"></div>
                <span className="text-gray-400">Jalur Rute</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedRoute && (
        <div className="bg-[#151922] border-x border-b border-[#3b2d4a] rounded-b-[10px] p-6 shadow-2xl relative transition-all duration-300 transform origin-top">
          <button 
            onClick={() => setSelectedRouteName(null)}
            className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-gray-200 font-bold tracking-wider text-base">{selectedRoute.name}</h2>
              <p className="text-[#3b82f6] text-[10px] font-bold tracking-widest uppercase mt-1">Route ID: {selectedRoute.routeId} • EN ROUTE</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 font-mono">Kecepatan: <strong>{selectedRoute.kecepatan} kn</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-[#10131a] p-4 rounded border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <MapIcon className="w-3.5 h-3.5" />
                <p className="text-[10px] font-mono">RUTE PERJALANAN</p>
              </div>
              <p className="text-gray-200 font-bold text-xs">{selectedRoute.origin} &rarr; {selectedRoute.destination}</p>
            </div>

            <div className="bg-[#10131a] p-4 rounded border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <ClockIcon className="w-3.5 h-3.5" />
                <p className="text-[10px] font-mono">ETA ESTIMASI</p>
              </div>
              <p className="text-gray-200 font-bold text-xs font-mono">{selectedRoute.eta}</p>
            </div>

            <div className="bg-[#10131a] p-4 rounded border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <BoltIcon className="w-3.5 h-3.5" />
                <p className="text-[10px] font-mono">BAHAN BAKAR (FUEL)</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-[#b06aee] rounded-full shadow-[0_0_10px_rgba(176,106,238,0.5)]" style={{ width: `${selectedRoute.fuel}%` }}></div>
                </div>
                <p className="text-gray-200 font-bold text-xs">{selectedRoute.fuel}%</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-gray-300 font-bold text-xs tracking-wider mb-3 flex items-center gap-1.5">
              <CubeIcon className="w-4 h-4 text-[#b06aee]" /> Daftar Pengiriman pada Rute ini
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {selectedRoute.shipments.map((s: any, idx: number) => (
                <div key={s.id} className="bg-[#1b202c] border border-white/5 p-3 rounded flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-purple-400 font-mono">#{idx+1}</span>
                      <span className="text-[9px] text-gray-500 font-mono">{s.tanggal_pengiriman}</span>
                    </div>
                    <p className="text-[10px] text-white font-mono truncate mb-2">{s.nomor_resi}</p>
                    <p className="text-[9px] text-gray-400 truncate">Customer: {s.nama_pengirim}</p>
                    <p className="text-[9px] text-gray-400 truncate">Penerima: {s.nama_penerima || '-'}</p>
                  </div>
                  <div className="mt-2 pt-2 border-t border-white/5 text-[9px] text-gray-500">
                    {s.pelabuhan_asal.split(',')[0]} &rarr; {s.pelabuhan_tujuan.split(',')[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

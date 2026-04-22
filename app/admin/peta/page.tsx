"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  XMarkIcon,
  MapIcon,
  PaperAirplaneIcon,
  ClockIcon,
  BoltIcon,
  ScaleIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

const PetaMap = dynamic(() => import('./PetaMap'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 w-full h-full bg-[#0a0d14] flex items-center justify-center animate-pulse"><span className="text-gray-500 font-mono text-sm">Loading Map...</span></div>
});

export default function PetaGlobalPage() {
  const initialShips = [
    { name: 'ANAGATA PIONEER', type: 'Container', status: 'En Route', kapten: 'Kapten Budi Santoso', tujuan: 'Los Angeles', kecepatan: '17.888882420316165' },
    { name: 'ANAGATA OCEAN', type: 'Bulk Carrier', status: 'In Port', kapten: 'Kapten Agus Wijaya', tujuan: 'Singapore', kecepatan: '0' },
    { name: 'ANAGATA WAVE', type: 'Tanker', status: 'Delayed', kapten: 'Kapten Andi Pratama', tujuan: 'Sydney', kecepatan: '12.3' },
    { name: 'ANAGATA VOYAGER', type: 'Container', status: 'En Route', kapten: 'Kapten Hendra Kusuma', tujuan: 'Rotterdam', kecepatan: '20.61672740950364' },
    { name: 'ANAGATA HORIZON', type: 'Ro-Ro', status: 'Maintenance', kapten: 'Kapten Dedi Setiawan', tujuan: 'New York', kecepatan: '0' },
    { name: 'ANAGATA NAVIGATOR', type: 'Container', status: 'En Route', kapten: 'Kapten Rudi Hartono', tujuan: 'Hong Kong', kecepatan: '21.19890074439647' },
    { name: 'ANAGATA GUARDIAN', type: 'Bulk Carrier', status: 'En Route', kapten: 'Kapten Bambang Suryadi', tujuan: 'Santos', kecepatan: '16.35021022308469' },
    { name: 'ANAGATA SENTINEL', type: 'Tanker', status: 'In Port', kapten: 'Kapten Arief Budiman', tujuan: 'Dubai', kecepatan: '0' },
  ];

  const availableStatuses = [
    { status: 'En Route' },
    { status: 'In Port' },
    { status: 'Delayed' },
    { status: 'Maintenance' },
  ];

  const [shipsData, setShipsData] = useState(initialShips);
  const [selectedShipName, setSelectedShipName] = useState<string | null>(null);

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
            kecepatan: newSpeed
          };
        })
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const selectedShip = shipsData.find(s => s.name === selectedShipName);

  const getStatusColorClass = (status: string) => {
    switch(status) {
      case 'En Route': return 'text-[#3b82f6]';
      case 'In Port': return 'text-[#06b6d4]';
      case 'Delayed': return 'text-[#eab308]';
      case 'Maintenance': return 'text-[#f43f5e]';
      default: return 'text-gray-400';
    }
  };

  const shipCoordinates: Record<string, [number, number]> = {
    'Los Angeles': [34.0522, -118.2437],
    'Singapore': [1.2902, 103.8519],
    'Sydney': [-33.8688, 151.2093],
    'Rotterdam': [51.9225, 4.47917],
    'New York': [40.7128, -74.0060],
    'Hong Kong': [22.3193, 114.1694],
    'Santos': [-23.9618, -46.3322],
    'Dubai': [25.2048, 55.2708]
  };

  return (
    <main className="mx-auto px-6 py-10 relative z-10 w-full max-w-[1500px]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Tampilan Peta Global</h2>
        <p className="text-gray-400 text-xs tracking-wider">Posisi kapal real-time</p>
      </div>

      <div className="bg-[#10131a] border border-white/5 rounded-t-[10px] p-0 relative shadow-lg overflow-hidden flex flex-col h-[500px]">
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
          <h3 className="text-xs font-bold text-gray-300 tracking-widest uppercase bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded border border-white/10">GLOBAL FLEET MAP</h3>
          <p className="text-[10px] text-gray-400 font-mono flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded border border-white/10">
            <MapIcon className="w-4 h-4" /> {shipsData.length} vessels tracked
          </p>
        </div>

        <div className="flex-1 relative border border-white/5 bg-[#0a0d14] overflow-hidden">
          <PetaMap ships={shipsData} onShipClick={(name) => setSelectedShipName(name)} />

          <div className="absolute bottom-4 right-4 border border-white/10 bg-[#151922]/90 backdrop-blur-md p-4 rounded text-[10px] w-40 z-10 shadow-xl pointer-events-none">
            <h4 className="font-bold text-gray-300 tracking-wider mb-3">STATUS</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#3b82f6] shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div>
                <span className="text-gray-400">Berlayar</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#06b6d4] shadow-[0_0_5px_rgba(6,182,214,0.8)]"></div>
                <span className="text-gray-400">Di Pelabuhan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#eab308] shadow-[0_0_5px_rgba(234,179,8,0.8)]"></div>
                <span className="text-gray-400">Tertunda</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#f43f5e] shadow-[0_0_5px_rgba(244,63,94,0.8)]"></div>
                <span className="text-gray-400">Pemeliharaan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedShip && (
        <div className="bg-[#151922] border-x border-b border-[#3b2d4a] rounded-b-[10px] p-6 shadow-2xl relative transition-all duration-300 transform origin-top">
          <button 
            onClick={() => setSelectedShipName(null)}
            className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          
          <div className="mb-6">
            <h2 className="text-gray-200 font-bold tracking-wider text-base">{selectedShip.name}</h2>
            <p className={`${getStatusColorClass(selectedShip.status)} text-[10px] font-bold tracking-widest uppercase mt-1`}>{selectedShip.status}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <MapIcon className="w-3.5 h-3.5" />
                <p className="text-[10px]">Type</p>
              </div>
              <p className="text-gray-200 font-bold text-sm">{selectedShip.type}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <PaperAirplaneIcon className="w-3.5 h-3.5" />
                <p className="text-[10px]">Speed</p>
              </div>
              <p className="text-gray-200 font-bold text-sm">{Number(selectedShip.kecepatan).toFixed(2)} kn</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <MapIcon className="w-3.5 h-3.5" />
                <p className="text-[10px]">Dest</p>
              </div>
              <p className="text-gray-200 font-bold text-sm">{selectedShip.tujuan}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <ClockIcon className="w-3.5 h-3.5" />
                <p className="text-[10px]">ETA</p>
              </div>
              <p className="text-gray-200 font-bold text-sm font-mono">2026-04-20 16:00</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <p className="text-[10px]">Lat</p>
              </div>
              <p className="text-gray-200 font-bold text-sm">{shipCoordinates[selectedShip.tujuan]?.[0]?.toFixed(2)}°</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <p className="text-[10px]">Lon</p>
              </div>
              <p className="text-gray-200 font-bold text-sm">{shipCoordinates[selectedShip.tujuan]?.[1]?.toFixed(2)}°</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <p className="text-[10px]">Heading</p>
              </div>
              <p className="text-gray-200 font-bold text-sm">0°</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <p className="text-[10px]">Fuel</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-[#b06aee] w-[35%] rounded-full shadow-[0_0_10px_rgba(176,106,238,0.5)]"></div>
                </div>
                <p className="text-gray-200 font-bold text-xs">35%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

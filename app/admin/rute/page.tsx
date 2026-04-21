"use client";

import React from 'react';
import { 
  MapPinIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const RoutePathIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="19" r="2.5" />
    <path d="M15.5 5H8a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h8a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H8.5" />
  </svg>
);

export default function ManajemenRutePage() {
  const routes = [
    {
      ship: 'ANAGATA PIONEER',
      routeId: 'R001',
      origin: 'Tokyo, Japan',
      destination: 'Los Angeles, USA',
      distance: '4800 nm',
      duration: '240 hrs',
      waypoints: 4,
      status: 'ACTIVE',
    },
    {
      ship: 'ANAGATA OCEAN',
      routeId: 'R002',
      origin: 'Jakarta, Indonesia',
      destination: 'Singapore',
      distance: '550 nm',
      duration: '36 hrs',
      waypoints: 2,
      status: 'COMPLETED',
    },
    {
      ship: 'ANAGATA WAVE',
      routeId: 'R003',
      origin: 'Brisbane, Australia',
      destination: 'Sydney, Australia',
      distance: '400 nm',
      duration: '24 hrs',
      waypoints: 1,
      status: 'ACTIVE',
    }
  ];

  return (
    <main className="mx-auto px-6 py-10 relative z-10 w-full max-w-[1500px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Manajemen Rute</h2>
          <p className="text-gray-400 text-xs tracking-wider">Kelola rute perjalanan kapal</p>
        </div>
        <button className="bg-[#b06aee] hover:bg-[#9a54d6] text-white px-4 py-2 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all font-bold text-xs tracking-wider flex items-center gap-2">
          + Tambah Rute
        </button>
      </div>

      <div className="space-y-4 mb-20">
        {routes.map((route, idx) => (
          <div key={idx} className="bg-[#151922] border border-white/5 rounded-[10px] flex flex-col hover:border-white/10 transition-colors">
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-[#b06aee]/10 flex items-center justify-center border border-[#b06aee]/30 shrink-0">
                    <RoutePathIcon className="w-5 h-5 text-[#b06aee]" />
                  </div>
                  <div>
                    <h3 className="text-gray-200 font-bold tracking-wider text-sm">{route.ship}</h3>
                    <p className="text-[11px] text-gray-500 font-mono mt-1">Route ID: {route.routeId}</p>
                  </div>
                </div>
                
                <div className={`px-2.5 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                  route.status === 'ACTIVE' ? 'bg-[#3b82f6]/10 text-[#3b82f6]' : 'bg-[#10b981]/10 text-[#10b981]'
                }`}>
                  {route.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-4">
                <div className="flex gap-2 items-start md:col-span-2">
                  <MapPinIcon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Origin</p>
                    <p className="text-gray-200 font-bold text-sm tracking-wide">{route.origin}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 items-start">
                  <PaperAirplaneIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Destination</p>
                    <p className="text-gray-200 font-bold text-sm tracking-wide">{route.destination}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500 mb-1">Distance</p>
                  <p className="text-gray-200 font-bold text-xs">{route.distance}</p>
                </div>
                
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">Duration</p>
                  <p className="text-gray-200 font-bold text-xs">{route.duration}</p>
                </div>
                
                <div>
                  <p className="text-[10px] text-gray-500 mb-1">Waypoints</p>
                  <p className="text-gray-200 font-bold text-xs">{route.waypoints}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 px-6 py-4 flex justify-end gap-3 mt-auto">
              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#1c1825] border border-[#b06aee]/30 text-[#b06aee] hover:bg-[#b06aee]/20 text-[11px] font-bold rounded transition-colors tracking-wide">
                <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 bg-[#251515] border border-rose-500/30 text-rose-500 hover:bg-rose-500/20 text-[11px] font-bold rounded transition-colors tracking-wide">
                <TrashIcon className="w-3.5 h-3.5" /> Hapus
              </button>
            </div>

          </div>
        ))}
      </div>
    </main>
  );
}

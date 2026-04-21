"use client";

import React, { useState } from 'react';
import { 
  XMarkIcon,
  MapIcon,
  PaperAirplaneIcon,
  ClockIcon,
  BoltIcon,
  ScaleIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

export default function PetaGlobalPage() {
  const [selectedShip, setSelectedShip] = useState<boolean>(true);

  return (
    <main className="mx-auto px-6 py-10 relative z-10 w-full max-w-[1500px]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Tampilan Peta Global</h2>
        <p className="text-gray-400 text-xs tracking-wider">Posisi kapal real-time</p>
      </div>

      <div className="bg-[#10131a] border border-white/5 rounded-t-[10px] p-6 relative shadow-lg overflow-hidden flex flex-col h-[500px]">
        <div className="flex justify-between items-center mb-4 z-10">
          <h3 className="text-xs font-bold text-gray-300 tracking-widest uppercase">GLOBAL FLEET MAP</h3>
          <p className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
            <MapIcon className="w-4 h-4" /> 8 vessels tracked
          </p>
        </div>

        <div className="flex-1 relative border border-white/5 bg-[#0a0d14] rounded overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxjaXJjbGUgY3g9IjEiIGN5PSIxIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiAvPgo8L3N2Zz4=')] opacity-50"></div>
          
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5 border-b border-dashed border-white/5"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 border-r border-dashed border-white/5"></div>

          <div className="absolute top-4 left-4 border border-white/10 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded text-[9px] text-gray-400 tracking-wider">
            Pelacakan Real-time
          </div>
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" width="100%" height="300" viewBox="0 0 1200 300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#071226"/>
                <stop offset="100%" stopColor="#0a1833"/>
              </linearGradient>

              <radialGradient id="glowBlue">
                <stop offset="0%" stopColor="#4da3ff" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#4da3ff" stopOpacity="0"/>
              </radialGradient>

              <radialGradient id="glowLight">
                <stop offset="0%" stopColor="#8be0ff" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#8be0ff" stopOpacity="0"/>
              </radialGradient>
            </defs>

            <rect width="1200" height="300" fill="url(#bg)" />

            <g stroke="#2a3a66" strokeWidth="0.5" opacity="0.4">
              <line x1="100" y1="0" x2="100" y2="300"/>
              <line x1="200" y1="0" x2="200" y2="300"/>
              <line x1="300" y1="0" x2="300" y2="300"/>
              <line x1="400" y1="0" x2="400" y2="300"/>
              <line x1="500" y1="0" x2="500" y2="300"/>
              <line x1="600" y1="0" x2="600" y2="300"/>
              <line x1="700" y1="0" x2="700" y2="300"/>
              <line x1="800" y1="0" x2="800" y2="300"/>
              <line x1="900" y1="0" x2="900" y2="300"/>
              <line x1="1000" y1="0" x2="1000" y2="300"/>
            </g>

            <g fill="none" stroke="#7c5cff" strokeWidth="1.5" opacity="0.7">
              <path d="M420 90 L450 80 L470 110 L460 160 L430 200 L400 170 Z"/>
              <path d="M560 60 L580 80 L600 120 L580 160 L560 210 L540 160 L530 120 L550 80 Z"/>
              <path d="M720 70 L780 50 L850 80 L880 130 L820 160 L790 200 L730 180 L700 130 Z"/>
              <path d="M820 190 L860 210 L880 240 L840 260 L800 250 L790 210 Z"/>
            </g>

            <g>
              <circle cx="350" cy="90" r="10" fill="#ff4d4d" stroke="white" strokeWidth="2"/>

              <circle cx="470" cy="170" r="20" fill="url(#glowBlue)"/>
              <circle cx="470" cy="170" r="5" fill="#4da3ff"/>

              <circle cx="600" cy="70" r="20" fill="url(#glowBlue)"/>
              <circle cx="600" cy="70" r="5" fill="#4da3ff"/>

              <circle cx="950" cy="90" r="25" fill="url(#glowBlue)"/>
              <circle cx="950" cy="90" r="6" fill="#4da3ff"/>

              <circle cx="800" cy="110" r="15" fill="url(#glowLight)"/>
              <circle cx="800" cy="110" r="4" fill="#8be0ff"/>

              <circle cx="900" cy="160" r="15" fill="url(#glowLight)"/>
              <circle cx="900" cy="160" r="4" fill="#8be0ff"/>
            </g>
          </svg>

          <div className="absolute bottom-4 right-4 border border-white/10 bg-[#151922]/90 backdrop-blur-md p-4 rounded text-[10px] w-40">
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
            onClick={() => setSelectedShip(!selectedShip)}
            className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
          
          <div className="mb-6">
            <h2 className="text-gray-200 font-bold tracking-wider text-base">ANAGATA HORIZON</h2>
            <p className="text-[#f43f5e] text-[10px] font-bold tracking-widest uppercase mt-1">MAINTENANCE</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-8">
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <MapIcon className="w-3.5 h-3.5" />
                <p className="text-[10px]">Type</p>
              </div>
              <p className="text-gray-200 font-bold text-sm">Ro-Ro</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <PaperAirplaneIcon className="w-3.5 h-3.5" />
                <p className="text-[10px]">Speed</p>
              </div>
              <p className="text-gray-200 font-bold text-sm">0.0 kn</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <MapIcon className="w-3.5 h-3.5" />
                <p className="text-[10px]">Dest</p>
              </div>
              <p className="text-gray-200 font-bold text-sm">New York</p>
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
              <p className="text-gray-200 font-bold text-sm">40.71°</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2 text-gray-500">
                <p className="text-[10px]">Lon</p>
              </div>
              <p className="text-gray-200 font-bold text-sm">-74.01°</p>
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

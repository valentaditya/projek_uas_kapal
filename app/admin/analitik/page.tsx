"use client";

import React from 'react';
import { 
  ArrowTrendingUpIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
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

export default function AnalitikPage() {
  const totalKapal = 8;
  const countEnRoute = 4;
  const countInPort = 2;
  const countDelayed = 1;
  const countMaintenance = 1;

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
            <p className="text-4xl font-black text-[#b06aee]">{totalKapal}</p>
          </div>
          <div className="w-12 h-12 rounded bg-[#b06aee]/10 flex items-center justify-center border border-[#b06aee]/20">
            <ShipIcon className="w-6 h-6 text-[#b06aee]" />
          </div>
        </div>
        
        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">EN ROUTE</p>
            <p className="text-4xl font-black text-[#3b82f6]">{countEnRoute}</p>
          </div>
          <div className="w-12 h-12 rounded bg-[#3b82f6]/10 flex items-center justify-center border border-[#3b82f6]/20">
            <ArrowTrendingUpIcon className="w-6 h-6 text-[#3b82f6]" />
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">IN PORT</p>
            <p className="text-4xl font-black text-[#06b6d4]">{countInPort}</p>
          </div>
          <div className="w-12 h-12 rounded bg-[#06b6d4]/10 flex items-center justify-center border border-[#06b6d4]/20">
            <AnchorIcon className="w-6 h-6 text-[#06b6d4]" />
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">DELAYED</p>
            <p className="text-4xl font-black text-[#eab308]">{countDelayed}</p>
          </div>
          <div className="w-12 h-12 rounded bg-[#eab308]/10 flex items-center justify-center border border-[#eab308]/20">
            <ClockIcon className="w-6 h-6 text-[#eab308]" />
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-5 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] text-gray-500 tracking-widest mb-1 font-semibold uppercase">MAINTENANCE</p>
            <p className="text-4xl font-black text-[#f97316]">{countMaintenance}</p>
          </div>
          <div className="w-12 h-12 rounded bg-[#f97316]/10 flex items-center justify-center border border-[#f97316]/20">
            <WrenchScrewdriverIcon className="w-6 h-6 text-[#f97316]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
        
        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-6 shadow-lg">
          <h3 className="text-[11px] font-bold text-gray-300 tracking-wider mb-6">DISTRIBUSI STATUS ARMADA</h3>
          <div className="h-48 relative flex items-end justify-around gap-2 px-4 pb-6 border-b border-l border-white/10">
            <div className="absolute left-[-20px] top-0 bottom-6 flex flex-col justify-between text-[9px] text-gray-500">
              <span>4 -</span>
              <span>3 -</span>
              <span>2 -</span>
              <span>1 -</span>
              <span>0 -</span>
            </div>
            
            <div className="w-full max-w-[80px] bg-[#b06aee] h-full rounded-t-sm flex items-end justify-center group relative">
              <span className="absolute -bottom-6 text-[9px] text-gray-400">En Route</span>
              <div className="absolute -top-8 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">4</div>
            </div>
            <div className="w-full max-w-[80px] bg-[#b06aee] h-[50%] rounded-t-sm flex items-end justify-center group relative opacity-80">
              <span className="absolute -bottom-6 text-[9px] text-gray-400">In Port</span>
              <div className="absolute -top-8 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">2</div>
            </div>
            <div className="w-full max-w-[80px] bg-[#b06aee] h-[25%] rounded-t-sm flex items-end justify-center group relative opacity-60">
              <span className="absolute -bottom-6 text-[9px] text-gray-400">Delayed</span>
              <div className="absolute -top-8 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">1</div>
            </div>
            <div className="w-full max-w-[80px] bg-[#b06aee] h-[25%] rounded-t-sm flex items-end justify-center group relative opacity-40">
              <span className="absolute -bottom-6 text-[9px] text-gray-400">Maintenance</span>
              <div className="absolute -top-8 bg-black/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">1</div>
            </div>
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-6 shadow-lg">
          <h3 className="text-[11px] font-bold text-gray-300 tracking-wider mb-6">DISTRIBUSI REGIONAL</h3>
          <div className="h-48 relative flex items-end justify-around gap-2 px-4 pb-6 border-b border-l border-white/10">
            <div className="absolute left-[-24px] top-0 bottom-6 flex flex-col justify-between text-[9px] text-gray-500">
              <span>1 -</span>
              <span>0.75-</span>
              <span>0.5 -</span>
              <span>0.25-</span>
              <span>0 -</span>
            </div>
            
            {['Pacific', 'Southeast Asia', 'Oceania', 'Europe', 'North America', 'East Asia', 'South America', 'Middle East'].map((region, i) => (
              <div key={i} className="w-full max-w-[40px] bg-[#3b82f6] h-full rounded-t-sm flex items-end justify-center group relative hover:bg-[#60a5fa] transition-colors cursor-pointer">
                <span className="absolute -bottom-10 text-[7px] text-gray-400 transform -rotate-45 whitespace-nowrap">{region}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-6 shadow-lg">
          <h3 className="text-[11px] font-bold text-gray-300 tracking-wider mb-6">LEVEL BAHAN BAKAR PER KAPAL</h3>
          <div className="h-48 relative border-b border-l border-white/10 p-2">
            <div className="absolute left-[-32px] top-0 bottom-0 flex flex-col justify-between text-[9px] text-gray-500">
              <span>V001 -</span>
              <span>V006 -</span>
              <span>V007 -</span>
              <span>V002 -</span>
              <span>0</span>
            </div>
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[9px] text-gray-500">
              <span>0</span>
              <span>0.25</span>
              <span>0.5</span>
              <span>0.75</span>
              <span>1</span>
            </div>
            
            <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-white/5 border-dashed border-b border-white/10"></div>
            <div className="absolute top-2/4 left-0 right-0 h-[1px] bg-white/5 border-dashed border-b border-white/10"></div>
            <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-white/5 border-dashed border-b border-white/10"></div>
            
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-600 font-mono italic">
              -- waiting for stream --
            </div>
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-[10px] p-6 shadow-lg">
          <h3 className="text-[11px] font-bold text-gray-300 tracking-wider mb-6">KECEPATAN SAAT INI (BERLAYAR)</h3>
          <div className="h-48 relative border-b border-l border-white/10">
             <div className="absolute left-[-20px] top-[-8px] bottom-6 flex flex-col justify-between text-[9px] text-gray-500">
              <span>24 -</span>
              <span>18 -</span>
              <span>12 -</span>
              <span>6 -</span>
              <span>0 -</span>
            </div>
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[9px] text-gray-500 px-4">
              <span>V001</span>
              <span>V004</span>
              <span>V006</span>
              <span>V007</span>
            </div>

            <div className="absolute top-1/4 left-0 right-0 h-[1px] bg-white/5 border-dashed border-b border-white/10"></div>
            <div className="absolute top-2/4 left-0 right-0 h-[1px] bg-white/5 border-dashed border-b border-white/10"></div>
            <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-white/5 border-dashed border-b border-white/10"></div>
            
            <div className="absolute inset-0 pt-4 px-4 pb-6">
              <svg className="w-full h-full" preserveAspectRatio="none">
                <polyline 
                  points="0,10 33%,50 66%,40 100%,70" 
                  fill="none" 
                  stroke="#06b6d4" 
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
                <circle cx="0" cy="10" r="4" fill="#06b6d4" className="animate-pulse" />
                <circle cx="33%" cy="50" r="4" fill="#06b6d4" />
                <circle cx="66%" cy="40" r="4" fill="#06b6d4" />
                <circle cx="100%" cy="70" r="4" fill="#06b6d4" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

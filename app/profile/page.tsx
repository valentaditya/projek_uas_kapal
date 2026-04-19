import Image from 'next/image';
import Link from 'next/link';

import {
  MapPinIcon,
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  GlobeAltIcon
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

export default function BerandaPage() {
  return (
    <div className="w-full flex justify-center pb-24">
      <div className="max-w-[1000px] w-full flex flex-col items-center">
        <section className="flex flex-col items-center text-center mt-24 mb-16 px-4">
          <div className="w-24 h-24 relative mb-6">
            <Image src="/profile/icon.png" alt="Anagata Oceanics Logo" fill className="object-contain drop-shadow-[0_0_25px_rgba(163,93,233,0.3)]" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-widest mb-4">ANAGATA OCEANICS</h2>
          <p className="text-sm md:text-base text-gray-400 mb-8 tracking-widest font-light">Solusi Logistik Maritim & Manajemen Armada Kapal</p>
          
          <Link href="/login" className="px-10 py-3 bg-[#a35de9] hover:bg-[#8643c7] transition-colors rounded text-sm font-semibold shadow-[0_0_20px_rgba(163,93,233,0.3)]">
            Mulai Sekarang
          </Link>
        </section>

        <section className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 px-6 mb-4">
          <div className="bg-[#13161f] border border-white/5 py-8 rounded flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#b06aee] mb-2">15+</span>
            <span className="text-xs text-gray-500">Tahun</span>
          </div>
          <div className="bg-[#13161f] border border-white/5 py-8 rounded flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#b06aee] mb-2">8</span>
            <span className="text-xs text-gray-500">Armada</span>
          </div>
          <div className="bg-[#13161f] border border-white/5 py-8 rounded flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#06b6d4] mb-2">50+</span>
            <span className="text-xs text-gray-500">Pelabuhan</span>
          </div>
          <div className="bg-[#13161f] border border-white/5 py-8 rounded flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#10b981] mb-2">1000+</span>
            <span className="text-xs text-gray-500">Pengiriman</span>
          </div>
        </section>

        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 px-6 mb-4">
          <div className="bg-[#13161f] border border-white/5 p-6 rounded flex flex-col items-start hover:border-[#b06aee]/30 transition-colors">
            <div className="w-10 h-10 bg-[#1b1928] rounded flex items-center justify-center mb-5">
               <ShipIcon className="w-5 h-5 text-[#b06aee]" />
            </div>
            <h4 className="font-bold text-sm mb-2">Request Pengiriman</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Buat request pengiriman dengan berbagai jenis kargo.
            </p>
          </div>
          <div className="bg-[#13161f] border border-white/5 p-6 rounded flex flex-col items-start hover:border-[#3b82f6]/30 transition-colors">
            <div className="w-10 h-10 bg-[#161c28] rounded flex items-center justify-center mb-5">
               <MapPinIcon className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <h4 className="font-bold text-sm mb-2">Real-Time Tracking</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Lacak posisi dan status pengiriman real-time.
            </p>
          </div>
          <div className="bg-[#13161f] border border-white/5 p-6 rounded flex flex-col items-start hover:border-[#06b6d4]/30 transition-colors">
            <div className="w-10 h-10 bg-[#162128] rounded flex items-center justify-center mb-5">
               <AnchorIcon className="w-5 h-5 text-[#06b6d4]" />
            </div>
            <h4 className="font-bold text-sm mb-2">Fleet Monitoring</h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Monitor armada kapal dan analytics lengkap.
            </p>
          </div>
        </section>

        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 px-6">
          <div className="bg-[#13161f] border border-white/5 p-6 rounded flex flex-col items-center justify-center hover:border-white/10 transition-colors">
            <CheckBadgeIcon className="w-6 h-6 text-[#b06aee] mb-3" />
            <h4 className="font-bold text-xs">ISO Certified</h4>
          </div>
          <div className="bg-[#13161f] border border-white/5 p-6 rounded flex flex-col items-center justify-center hover:border-white/10 transition-colors">
            <ArrowTrendingUpIcon className="w-6 h-6 text-[#06b6d4] mb-3" />
            <h4 className="font-bold text-xs">Data Analytics</h4>
          </div>
          <div className="bg-[#13161f] border border-white/5 p-6 rounded flex flex-col items-center justify-center hover:border-white/10 transition-colors">
            <GlobeAltIcon className="w-6 h-6 text-[#10b981] mb-3" />
            <h4 className="font-bold text-xs">Global Network</h4>
          </div>
        </section>
      </div>
    </div>
  );
}
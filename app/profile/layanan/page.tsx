import {
  GlobeAltIcon,
  MapPinIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  CubeIcon,
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

export default function LayananPage() {
  return (
    <div className="w-full flex justify-center py-20 pb-32">
      <div className="max-w-5xl w-full px-6">
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-wide text-white">Layanan Kami</h3>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            Solusi logistik maritim lengkap untuk mendukung kebutuhan bisnis Anda.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-5 mb-5">
          <div className="bg-[#13161f] p-8 rounded border border-white/5 hover:border-fuchsia-500/30 transition-all">
            <div className="w-10 h-10 bg-[#1b1928] rounded flex items-center justify-center mb-6">
              <ShipIcon className="w-5 h-5 text-[#d946ef]" />
            </div>
            <h4 className="font-bold text-[15px] mb-3 text-white">Pengiriman Container</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              FCL dan LCL untuk berbagai jenis kargo dengan standar keamanan internasional.
            </p>
            <ul className="text-[11px] text-gray-400 space-y-2">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#d946ef]"></div>Container 20ft & 40ft</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#d946ef]"></div>Container Berpendingin</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#d946ef]"></div>Container Kargo Khusus</li>
            </ul>
          </div>
          
          <div className="bg-[#13161f] p-8 rounded border border-white/5 hover:border-blue-500/30 transition-all">
            <div className="w-10 h-10 bg-[#161c28] rounded flex items-center justify-center mb-6">
              <GlobeAltIcon className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <h4 className="font-bold text-[15px] mb-3 text-white">Rute Internasional</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Rute pengiriman ke 50+ pelabuhan di seluruh dunia dengan jadwal reguler.
            </p>
            <ul className="text-[11px] text-gray-400 space-y-2">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>Rute Asia Pasifik</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>Rute Timur Tengah</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>Eropa & Amerika</li>
            </ul>
          </div>
          
          <div className="bg-[#13161f] p-8 rounded border border-white/5 hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 bg-[#162128] rounded flex items-center justify-center mb-6">
              <MapPinIcon className="w-5 h-5 text-[#06b6d4]" />
            </div>
            <h4 className="font-bold text-[15px] mb-3 text-white">Pelacakan GPS</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Monitor posisi kapal dan status barang secara real-time 24/7.
            </p>
            <ul className="text-[11px] text-gray-400 space-y-2">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></div>Update Posisi Real-time</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></div>Notifikasi Status</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]"></div>Prediksi Waktu Tiba</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-5">
          <div className="bg-[#13161f] p-6 rounded border border-white/5 flex flex-col items-center justify-center text-center">
            <AnchorIcon className="w-6 h-6 text-[#d946ef] mb-3" />
            <h4 className="font-bold text-[13px] text-white">Fleet Monitoring</h4>
            <p className="text-[10px] text-gray-500 mt-1">Monitoring armada real-time</p>
          </div>
          <div className="bg-[#13161f] p-6 rounded border border-white/5 flex flex-col items-center justify-center text-center">
            <CubeIcon className="w-6 h-6 text-[#3b82f6] mb-3" />
            <h4 className="font-bold text-[13px] text-white">Cargo Insurance</h4>
            <p className="text-[10px] text-gray-500 mt-1">Proteksi penuh kargo</p>
          </div>
          <div className="bg-[#13161f] p-6 rounded border border-white/5 flex flex-col items-center justify-center text-center">
            <ClockIcon className="w-6 h-6 text-[#06b6d4] mb-3" />
            <h4 className="font-bold text-[13px] text-white">24/7 Support</h4>
            <p className="text-[10px] text-gray-500 mt-1">Support sepanjang waktu</p>
          </div>
          <div className="bg-[#13161f] p-6 rounded border border-white/5 flex flex-col items-center justify-center text-center">
            <ArrowTrendingUpIcon className="w-6 h-6 text-[#10b981] mb-3" />
            <h4 className="font-bold text-[13px] text-white">Analytics</h4>
            <p className="text-[10px] text-gray-500 mt-1">Laporan dan insights</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#1b1928] flex items-center justify-center flex-shrink-0">
               <ShieldCheckIcon className="w-5 h-5 text-[#d946ef]" />
            </div>
            <div>
              <h4 className="font-bold text-[13px] text-white">Keamanan Terjamin</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">ISO certified dengan standar internasional</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#161c28] flex items-center justify-center flex-shrink-0">
               <ClockIcon className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <div>
              <h4 className="font-bold text-[13px] text-white">Tepat Waktu</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">98% on-time delivery rate</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#162128] flex items-center justify-center flex-shrink-0">
               <ArrowTrendingUpIcon className="w-5 h-5 text-[#06b6d4]" />
            </div>
            <div>
              <h4 className="font-bold text-[13px] text-white">Harga Kompetitif</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Tarif kompetitif dengan layanan premium</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded bg-[#15231c] flex items-center justify-center flex-shrink-0">
               <MapPinIcon className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <h4 className="font-bold text-[13px] text-white">Global Coverage</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Jangkauan ke 50+ pelabuhan dunia</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

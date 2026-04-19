import { CheckBadgeIcon, UserGroupIcon, ArrowTrendingUpIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export default function TentangPage() {
  return (
    <div className="w-full flex justify-center py-24 pb-32">
      <div className="max-w-6xl w-full px-6">
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-wide text-white">Tentang Kami</h3>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Anagata Oceanics adalah perusahaan terkemuka dalam bidang logistik maritim dan manajemen armada kapal di Indonesia
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-sm text-gray-300 leading-loose mb-6">
              Dengan pengalaman lebih dari 15 tahun di industri maritim, kami menyediakan layanan pengiriman barang melalui jalur laut dengan armada modern dan sistem tracking real-time untuk transparansi penuh.
            </p>
            <p className="text-sm text-gray-300 leading-loose mb-10">
              Sistem kami memudahkan admin untuk membuat request pengiriman, sementara user dapat melacak status barang mereka secara real-time dengan nomor tracking yang diberikan.
            </p>
            <button className="px-8 py-3 bg-[#a35de9] hover:bg-[#8643c7] transition-all rounded text-sm font-semibold shadow-[0_0_15px_rgba(163,93,233,0.3)] text-white">
              Pelajari Lebih Lanjut
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#151922] p-6 rounded border border-white/5 hover:border-fuchsia-500/30 hover:bg-[#1a1e29] transition-all group">
              <CheckBadgeIcon className="w-8 h-8 text-[#d946ef] mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-semibold mb-2 text-white">ISO Certified</h4>
              <p className="text-[11px] text-gray-400">Sertifikasi ISO 9001:2015</p>
            </div>
            <div className="bg-[#151922] p-6 rounded border border-white/5 hover:border-blue-500/30 hover:bg-[#1a1e29] transition-all group">
              <UserGroupIcon className="w-8 h-8 text-[#3b82f6] mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-semibold mb-2 text-white">Expert Team</h4>
              <p className="text-[11px] text-gray-400">Tim profesional berpengalaman</p>
            </div>
            <div className="bg-[#151922] p-6 rounded border border-white/5 hover:border-cyan-500/30 hover:bg-[#1a1e29] transition-all group">
              <ArrowTrendingUpIcon className="w-8 h-8 text-[#06b6d4] mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-semibold mb-2 text-white">Data Analytics</h4>
              <p className="text-[11px] text-gray-400">Real-time monitoring</p>
            </div>
            <div className="bg-[#151922] p-6 rounded border border-white/5 hover:border-green-500/30 hover:bg-[#1a1e29] transition-all group">
              <GlobeAltIcon className="w-8 h-8 text-[#10b981] mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-semibold mb-2 text-white">Global Network</h4>
              <p className="text-[11px] text-gray-400">Jaringan internasional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

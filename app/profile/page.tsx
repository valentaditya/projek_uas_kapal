import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRightOnRectangleIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  ChartBarIcon,
  GlobeAltIcon,
  TruckIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const AnchorIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5v16.5m-3-11.25h6m-9 3.75c0 4.97 4.03 9 9 9s9-4.03 9-9h-2.25l2.25-3 2.25 3h-2.25m-15.75 0h-2.25l2.25-3 2.25 3h-2.25" />
  </svg>
);

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-purple-500/30">

      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#0d1117]/40 backdrop-blur-md">
        <div className="flex items-center gap-4 ml-10">
          <div className="w-10 h-10 relative flex-shrink-0">
            <Image src="/profile/icon.png" alt="Anagata Oceanics Logo" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400">
              ANAGATA OCEANICS
            </h1>
            <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">Maritime Excellence</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-14">
          <Link href="/" className="text-sm font-medium text-[#b06aee] transition-colors">Beranda</Link>
          <Link href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Tentang</Link>
          <Link href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Layanan</Link>
          <Link href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Lacak Paket</Link>
          <Link href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Cek Biaya</Link>
          <Link href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Kontak</Link>
        </div>

        <Link href="/login" className="flex items-center gap-2 px-5 py-2 mr-10 bg-[#a35de9] hover:bg-[#8643c7] transition-all text-sm font-semibold rounded shadow-[0_0_15px_rgba(163,93,233,0.3)]">
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          Masuk ke Sistem
        </Link>
      </nav>

      <main className="flex flex-col items-center">
        <section className="flex flex-col items-center text-center mt-20 mb-28 px-4 max-w-4xl mx-auto">
          <div className="w-40 h-40 relative mb-5">
            <Image src="/profile/icon.png" alt="Anagata Oceanics Logo" fill className="object-contain" />
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl -z-10 rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">ANAGATA OCEANICS</h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 tracking-wide">Maritime Logistics & Fleet Management Solutions</p>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mb-12 leading-relaxed">
            Solusi terpercaya untuk pengiriman barang internasional melalui jalur laut dengan armada modern dan sistem tracking real-time di armada kapal modern.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="w-full sm:w-auto px-8 py-3 bg-[#a35de9] hover:bg-[#8643c7] transition-colors rounded text-sm font-semibold shadow-[0_0_20px_rgba(163,93,233,0.3)]">
              Mulai Sekarang
            </button>
            <button className="w-full sm:w-auto px-8 py-3 bg-transparent border border-white/20 hover:border-white/50 transition-colors rounded text-sm font-semibold hover:bg-white/5">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </section>

        <section className="w-full bg-[#13161f] py-16 mb-24">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-4">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-[#d946ef] mb-3">15+</span>
              <span className="text-xs tracking-wider text-gray-400 uppercase">Tahun Pengalaman</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-[#3b82f6] mb-3">8</span>
              <span className="text-xs tracking-wider text-gray-400 uppercase">Armada Kapal</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-[#06b6d4] mb-3">50+</span>
              <span className="text-xs tracking-wider text-gray-400 uppercase">Pelabuhan Global</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-[#10b981] mb-3">1000+</span>
              <span className="text-xs tracking-wider text-gray-400 uppercase">Pengiriman/Tahun</span>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 w-full mb-32">
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-wide">Tentang Kami</h3>
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
              <button className="px-8 py-3 bg-[#a35de9] hover:bg-[#8643c7] transition-all rounded text-sm font-semibold shadow-[0_0_15px_rgba(163,93,233,0.3)]">
                Mulai Pengiriman
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#151922] p-6 rounded-lg border border-white/5 hover:border-fuchsia-500/30 hover:bg-[#1a1e29] transition-all group">
                <CheckBadgeIcon className="w-8 h-8 text-[#d946ef] mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-semibold mb-2">ISO Certified</h4>
                <p className="text-[11px] text-gray-400">Sertifikasi ISO 9001:2015</p>
              </div>
              <div className="bg-[#151922] p-6 rounded-lg border border-white/5 hover:border-blue-500/30 hover:bg-[#1a1e29] transition-all group">
                <UserGroupIcon className="w-8 h-8 text-[#3b82f6] mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-semibold mb-2">Expert Team</h4>
                <p className="text-[11px] text-gray-400">Tim profesional berpengalaman</p>
              </div>
              <div className="bg-[#151922] p-6 rounded-lg border border-white/5 hover:border-cyan-500/30 hover:bg-[#1a1e29] transition-all group">
                <ChartBarIcon className="w-8 h-8 text-[#06b6d4] mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-semibold mb-2">Data Analytics</h4>
                <p className="text-[11px] text-gray-400">Real-time monitoring</p>
              </div>
              <div className="bg-[#151922] p-6 rounded-lg border border-white/5 hover:border-green-500/30 hover:bg-[#1a1e29] transition-all group">
                <GlobeAltIcon className="w-8 h-8 text-[#10b981] mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-sm font-semibold mb-2">Global Network</h4>
                <p className="text-[11px] text-gray-400">Jaringan internasional</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-[#13161f] py-24">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-wide">Layanan Kami</h3>
              <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
                Solusi lengkap untuk kebutuhan logistik maritim Anda
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#0d1117] p-8 rounded border border-white/5 hover:border-fuchsia-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-150 transition-transform duration-500">
                  <TruckIcon className="w-32 h-32 text-[#d946ef]" />
                </div>
                <div className="w-12 h-12 bg-[#1b1c2b] rounded-lg flex items-center justify-center mb-6">
                  <TruckIcon className="w-6 h-6 text-[#d946ef]" />
                </div>
                <h4 className="font-bold text-base mb-3">Request Pengiriman</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Admin dapat membuat request pengiriman barang dengan berbagai jenis kargo melalui sistem yang terintegrasi.
                </p>
              </div>
              
              <div className="bg-[#0d1117] p-8 rounded border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-150 transition-transform duration-500">
                  <MapPinIcon className="w-32 h-32 text-[#3b82f6]" />
                </div>
                <div className="w-12 h-12 bg-[#1b1e2c] rounded-lg flex items-center justify-center mb-6">
                  <MapPinIcon className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <h4 className="font-bold text-base mb-3">Real-Time Tracking</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  User dapat melacak posisi dan status pengiriman secara real-time dengan sistem GPS terintegrasi.
                </p>
              </div>
              
              <div className="bg-[#0d1117] p-8 rounded border border-white/5 hover:border-cyan-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-150 transition-transform duration-500">
                  <AnchorIcon className="w-32 h-32 text-[#06b6d4]" />
                </div>
                <div className="w-12 h-12 bg-[#19222c] rounded-lg flex items-center justify-center mb-6">
                  <AnchorIcon className="w-6 h-6 text-[#06b6d4]" />
                </div>
                <h4 className="font-bold text-base mb-3">Fleet Monitoring</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Monitor armada kapal, status pengiriman, dan analytics lengkap untuk operasional yang optimal.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-gradient-to-br from-[#1a1528] to-[#12111c] py-24 text-center px-4 relative overflow-hidden border-y border-fuchsia-900/20">
          <div className="absolute inset-0 bg-fuchsia-500/5 mix-blend-overlay"></div>
          <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">Siap Memulai Pengiriman?</h3>
            <p className="text-sm text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Bergabunglah dengan ratusan perusahaan yang mempercayai Anagata Oceanics untuk kebutuhan logistik maritim mereka.
            </p>
            <Link href="/login" className="px-10 py-3.5 bg-[#a35de9] hover:bg-[#8643c7] transition-all rounded text-sm font-semibold shadow-[0_0_20px_rgba(163,93,233,0.3)]">
              Masuk ke Sistem
            </Link>
          </div>
        </section>
      </main>

      <footer className="w-full bg-[#0d1117] pt-16 pb-8 px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 relative">
                <Image src="/profile/icon.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="font-bold text-sm tracking-widest text-[#a35de9]">ANAGATA</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
              Solusi logistik maritim terpercaya untuk kebutuhan bisnis Anda.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold text-[13px] mb-6 text-white uppercase tracking-wider">Perusahaan</h5>
            <ul className="flex flex-col gap-4 text-xs text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Layanan</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Armada</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Kontak</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold text-[13px] mb-6 text-white uppercase tracking-wider">Layanan</h5>
            <ul className="flex flex-col gap-4 text-xs text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Container Shipping</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Bulk Cargo</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Tracking</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Customer Support</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold text-[13px] mb-6 text-white uppercase tracking-wider">Kontak</h5>
            <ul className="flex flex-col gap-4 text-xs text-gray-400">
              <li>Email: info@anagataoceanics.com</li>
              <li>Phone: +62 21 1234 5678</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto pt-8 border-t border-white/5 text-center flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-[11px] text-gray-600">
            © 2026 Anagata Oceanics. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

import { 
  UserCircleIcon, 
  MapPinIcon, 
  CubeIcon,
  PaperAirplaneIcon,
  ArrowDownOnSquareIcon
} from '@heroicons/react/24/outline';

export default function KirimPaketPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 relative z-10 w-full space-y-6 flex-1">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Kirim Paket Baru</h2>
        <p className="text-gray-400 text-xs tracking-wider">Isi formulir di bawah untuk membuat request pengiriman barang melalui jalur laut</p>
      </div>

      <form className="space-y-6">
        
        <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
            <UserCircleIcon className="w-4 h-4 text-[#b06aee]" /> Informasi Pengirim
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nama Pengirim <span className="text-rose-500">*</span></label>
              <input type="text" defaultValue="Customer User" required className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Email <span className="text-rose-500">*</span></label>
              <input type="email" required className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nomor Telepon <span className="text-rose-500">*</span></label>
              <input type="tel" required className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Alamat</label>
              <input type="text" className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
            <ArrowDownOnSquareIcon className="w-4 h-4 text-[#3b82f6]" /> Informasi Penerima
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nama Penerima <span className="text-rose-500">*</span></label>
              <input type="text" required className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Email</label>
              <input type="email" className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nomor Telepon</label>
              <input type="tel" className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Alamat</label>
              <input type="text" className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
            <MapPinIcon className="w-4 h-4 text-[#10b981]" /> Detail Pengiriman
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Pelabuhan Asal <span className="text-rose-500">*</span></label>
              <input type="text" required className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Pelabuhan Tujuan <span className="text-rose-500">*</span></label>
              <input type="text" required className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Tanggal <span className="text-rose-500">*</span></label>
              <input type="date" required className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 font-mono tracking-tight" />
            </div>
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
            <CubeIcon className="w-4 h-4 text-[#10b981]" /> Detail Kargo
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Jenis Barang <span className="text-rose-500">*</span></label>
              <input type="text" required className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Berat (kg) <span className="text-rose-500">*</span></label>
              <input type="number" required placeholder="Berat dalam kg" className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Volume (m³)</label>
              <input type="number" placeholder="Volume dalam m³" className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Deskripsi <span className="text-rose-500">*</span></label>
              <input type="text" required placeholder="Elektronik, Furniture, dll" className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Catatan Tambahan</label>
            <textarea rows={3} placeholder="Instruksi khusus atau catatan" className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight resize-none"></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pb-10">
          <button type="reset" className="px-6 py-2 rounded-md bg-[#6b21a8] text-white hover:bg-[#581c87] transition-colors font-bold text-xs tracking-wider shadow">
            Reset
          </button>
          <button type="submit" className="px-6 py-2 rounded-md bg-[#a855f7] hover:bg-[#9333ea] text-white transition-colors font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2">
            <PaperAirplaneIcon className="w-4 h-4" /> Submit Pengiriman
          </button>
        </div>

      </form>
    </main>
  );
}

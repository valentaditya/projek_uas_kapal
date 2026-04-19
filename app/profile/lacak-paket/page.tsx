import { CubeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Adjust outline vs solid as needed

export default function LacakPaketPage() {
  return (
    <div className="w-full flex justify-center py-20 pb-32">
      <div className="max-w-4xl w-full px-6">
        <div className="text-center mb-16 flex flex-col items-center">
          <CubeIcon className="w-12 h-12 text-[#d946ef] mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-wide text-white">Lacak Paket Anda</h3>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            Pantau posisi dan status pengiriman barang secara real-time.
          </p>
        </div>
        
        <div className="bg-[#13161f] border border-white/5 rounded-lg p-8 mb-6">
          <h4 className="font-bold text-sm text-white mb-4">Masukkan Nomor Tracking</h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Contoh: AO-2026-04-12345" 
              className="flex-grow bg-[#0d1017] border border-white/5 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d946ef]/50 transition-colors placeholder:text-gray-600"
            />
            <button className="flex items-center justify-center gap-2 px-8 py-3 bg-[#a35de9] hover:bg-[#8643c7] transition-all rounded text-sm font-semibold text-white shadow-[0_0_15px_rgba(163,93,233,0.3)]">
              <MagnifyingGlassIcon className="w-4 h-4" />
              Lacak
            </button>
          </div>
        </div>
        
        <div className="bg-[#13161f] border border-white/5 rounded-lg p-16 flex flex-col items-center justify-center text-center">
          <CubeIcon className="w-10 h-10 text-gray-500 mb-6" />
          <h4 className="font-bold text-[15px] text-white mb-3">Belum Ada Hasil Tracking</h4>
          <p className="text-xs text-gray-400 mb-2">
            Masukkan nomor tracking untuk melihat status dan posisi paket.
          </p>
          <p className="text-[11px] text-gray-600">
            Nomor tracking dapat ditemukan pada email konfirmasi atau dengan menghubungi customer service.
          </p>
        </div>
      </div>
    </div>
  );
}

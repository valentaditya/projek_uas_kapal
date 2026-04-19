import { CalculatorIcon, MapPinIcon, ScaleIcon, CubeIcon } from '@heroicons/react/24/outline'; 

export default function CekBiayaPage() {
  return (
    <div className="w-full flex justify-center py-20 pb-32">
      <div className="max-w-6xl w-full px-6">
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="w-12 h-12 border border-[#d946ef]/30 rounded flex items-center justify-center mb-6">
            <CalculatorIcon className="w-6 h-6 text-[#d946ef]" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-wide text-white">Kalkulator Biaya Pengiriman</h3>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            Hitung estimasi biaya pengiriman berdasarkan rute, berat, dan jenis kargo.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-[#13161f] border border-white/5 rounded-lg p-8">
            <h4 className="font-bold text-[15px] text-white mb-6">Informasi Pengiriman</h4>
            
            <div className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2">
                  <MapPinIcon className="w-4 h-4 text-gray-500" />
                  Pelabuhan Asal
                </label>
                <input 
                  type="text" 
                  className="w-full bg-[#0d1017] border border-white/5 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d946ef]/50 transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2">
                  <MapPinIcon className="w-4 h-4 text-gray-500" />
                  Pelabuhan Tujuan
                </label>
                <input 
                  type="text" 
                  className="w-full bg-[#0d1017] border border-white/5 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d946ef]/50 transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2">
                  <ScaleIcon className="w-4 h-4 text-gray-500" />
                  Berat Paket (kg)
                </label>
                <input 
                  type="text" 
                  placeholder="Masukkan berat dalam kilogram"
                  className="w-full bg-[#0d1017] border border-white/5 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d946ef]/50 transition-colors placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2">
                  <CubeIcon className="w-4 h-4 text-gray-500" />
                  Jenis Barang
                </label>
                <input 
                  type="text" 
                  className="w-full bg-[#0d1017] border border-white/5 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d946ef]/50 transition-colors"
                />
              </div>
              
              <button className="w-full flex items-center justify-center gap-2 px-8 py-3.5 mt-4 bg-[#a35de9] hover:bg-[#8643c7] transition-all rounded text-sm font-semibold text-white shadow-[0_0_15px_rgba(163,93,233,0.3)]">
                <CalculatorIcon className="w-4 h-4" />
                Hitung Biaya Pengiriman
              </button>
            </div>
          </div>
          
          <div className="bg-[#13161f] border border-white/5 rounded-lg p-16 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
             <CalculatorIcon className="w-12 h-12 text-gray-600 mb-6" />
             <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
               Masukkan informasi pengiriman untuk melihat estimasi biaya
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

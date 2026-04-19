import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline'; 

export default function KontakPage() {
  return (
    <div className="w-full flex justify-center py-24 pb-32">
      <div className="max-w-5xl w-full px-6">
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-wide text-white">Hubungi Kami</h3>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            Kami siap membantu menjawab pertanyaan dan memberikan solusi terbaik untuk kebutuhan Anda.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#13161f] border border-white/5 p-8 rounded-lg">
            <div className="w-10 h-10 bg-[#1b1928] rounded flex items-center justify-center mb-6">
               <EnvelopeIcon className="w-5 h-5 text-[#d946ef]" />
            </div>
            <h4 className="font-bold text-[15px] text-white mb-4">Email</h4>
            <div className="flex flex-col gap-1.5 text-xs text-gray-400">
               <p>info@anagataoceanics.com</p>
               <p>support@anagataoceanics.com</p>
            </div>
          </div>
          
          <div className="bg-[#13161f] border border-white/5 p-8 rounded-lg">
            <div className="w-10 h-10 bg-[#161c28] rounded flex items-center justify-center mb-6">
               <PhoneIcon className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <h4 className="font-bold text-[15px] text-white mb-4">Telepon</h4>
            <div className="flex flex-col gap-1.5 text-xs text-gray-400">
               <p>+62 21 1234 5678</p>
               <p>+62 21 8765 4321 (24/7)</p>
            </div>
          </div>

          <div className="bg-[#13161f] border border-white/5 p-8 rounded-lg">
            <div className="w-10 h-10 bg-[#162128] rounded flex items-center justify-center mb-6">
               <MapPinIcon className="w-5 h-5 text-[#06b6d4]" />
            </div>
            <h4 className="font-bold text-[15px] text-white mb-4">Alamat Kantor</h4>
            <div className="flex flex-col gap-1.5 text-xs text-gray-400">
               <p>Jl. Tanjung Priok No. 123</p>
               <p>Jakarta Utara 14310</p>
               <p>Indonesia</p>
            </div>
          </div>

          <div className="bg-[#13161f] border border-white/5 p-8 rounded-lg">
            <div className="w-10 h-10 bg-[#15231c] rounded flex items-center justify-center mb-6">
               <ClockIcon className="w-5 h-5 text-[#10b981]" />
            </div>
            <h4 className="font-bold text-[15px] text-white mb-4">Jam Operasional</h4>
            <div className="flex flex-col gap-1.5 text-xs text-gray-400">
               <p>Senin - Jumat: 08.00 - 18.00 WIB</p>
               <p>Sabtu: 08.00 - 14.00 WIB</p>
               <p>Minggu: Tutup</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

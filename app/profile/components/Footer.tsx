import Image from 'next/image';

export default function ProfileFooter() {
  return (
    <footer className="w-full bg-[#0d1321] py-6 px-4 md:px-10 border-t border-white/5 flex items-center justify-center lg:justify-between text-white mt-auto">
      <div className="hidden lg:flex items-center gap-4 ml-2 lg:ml-10">
        <div className="w-8 h-8 relative opacity-70">
          <Image src="/profile/icon.png" alt="Logo" fill className="object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-widest">ANAGATA OCEANICS</span>
          <span className="text-[10px] text-gray-500">Solusi Logistik Maritim Terpercaya</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[11px] text-gray-500 mr-2 lg:mr-10 tracking-wide text-center">
        <span>© 2026 Anagata Oceanics</span>
        <span className="opacity-30">•</span>
        <span>Jakarta, Indonesia</span>
        <span className="opacity-30">•</span>
        <span>info@anagataoceanics.com</span>
      </div>
    </footer>
  );
}

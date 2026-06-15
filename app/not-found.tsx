import Link from 'next/link';

export const metadata = {
  title: 'Halaman Tidak Ditemukan',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0e1017] text-gray-200 font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Cahaya ilahi  latar belakang */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="z-10 text-center max-w-md flex flex-col items-center">
        {/* Ikon */}
        <div className="w-20 h-20 relative mb-8 flex items-center justify-center bg-purple-500/10 rounded-full border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)] animate-pulse">
          <svg className="w-10 h-10 text-[#b06aee]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-widest mb-4">
          404
        </h1>
        
        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-3">
          Halaman Tidak Ditemukan
        </h2>
        
        <p className="text-gray-400 text-xs leading-relaxed mb-8">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan. Silakan kembali ke halaman utama.
        </p>

        <Link 
          href="/profile" 
          className="bg-[#b06aee] hover:bg-[#9a54d6] text-white px-6 py-3 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all font-bold text-xs tracking-wider uppercase"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

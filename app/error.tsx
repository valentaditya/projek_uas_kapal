"use client";

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Captured Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0e1017] text-gray-200 font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 text-center max-w-md flex flex-col items-center">
        <div className="w-20 h-20 relative mb-8 flex items-center justify-center bg-red-500/10 rounded-full border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-bounce">
          <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <h1 className="text-4xl font-black text-rose-500 tracking-wider mb-4">
          TERJADI KESALAHAN
        </h1>
        
        <p className="text-gray-400 text-xs leading-relaxed mb-8">
          Sistem mendeteksi kesalahan yang tidak terduga saat memuat halaman ini. Silakan coba muat ulang halaman.
        </p>

        <div className="flex gap-4">
          <button 
            onClick={() => reset()}
            className="bg-[#b06aee] hover:bg-[#9a54d6] text-white px-6 py-3 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all font-bold text-xs tracking-wider uppercase"
          >
            Muat Ulang Halaman
          </button>
          
          <button 
            onClick={() => window.location.href = '/profile'}
            className="bg-transparent border border-white/10 hover:bg-white/5 text-gray-300 px-6 py-3 rounded-md transition-all font-bold text-xs tracking-wider uppercase"
          >
            Ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}

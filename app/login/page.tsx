"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';



export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (login: React.FormEvent<HTMLFormElement>) => {
    login.preventDefault();

    const username = (login.currentTarget.elements.namedItem('username') as HTMLInputElement)?.value;
    const password = (login.currentTarget.elements.namedItem('password') as HTMLInputElement)?.value;

    if (username === "Valent" && password === "Valent" || username === "Laurent" && password === "Laurent" || username === "Samuel" && password === "Samuel") {
      Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      theme: 'auto',
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    }).fire({
      icon: "success",
      title: "Signed in successfully"
    });
    router.push('/dashboard');
    }
    else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Username atau Password salah",
        showConfirmButton: false,
        timer: 2000,
        theme: 'auto'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0a1c] bg-radial flex flex-col items-center justify-center relative overflow-hidden" 
         style={{ background: 'radial-gradient(circle at center, #1b1236 0%, #0a0614 100%)' }}>
    
      <div className="w-full max-w-[400px] bg-[#12111d] rounded-xl border-t border-purple-500/30 border-b border-b-cyan-500/20 shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)] overflow-hidden relative z-10" style={{ boxShadow: '0 0 30px 10px rgba(100, 50, 200, 0.1), inset 0 0 15px rgba(255,255,255,0.02)' }}>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        
        <div className="p-10 flex flex-col items-center">
          
          <div className="mb-6 relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8a2be2] to-[#0088ff] flex items-center justify-center shadow-[0_0_25px_0_rgba(100,50,250,0.5)] relative z-10 p-1 overflow-hidden">
              <Image 
                src="/icon-kapal.png" 
                alt="Logo Kapal" 
                width={40} 
                height={40} 
                className="object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" 
              />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-500 rounded-full blur-[30px] opacity-20"></div>
          </div>
          
          <div className="text-center mb-2 font-black tracking-widest text-2xl flex gap-2 justify-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e075ff] to-[#a352ff]">PRIMELOG</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d0ff] to-[#0088ff] ml-1">FLEET</span>
          </div>

          <div className="text-center mb-4">
            <h2 className="font-mono text-[11px] font-bold text-gray-300 tracking-wider">
              Maritime Tracking System v2.0
            </h2>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.8)] relative">
              <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
            </div>
            <span className="text-[10px] font-mono font-bold text-green-400 tracking-wider">SYSTEM ONLINE</span>
          </div>
          
          {/* Form */}
          <form className="w-full" onSubmit={handleLogin}>
            <div className="mb-5">
              <label className="block text-[10px] font-mono font-bold text-gray-300 tracking-widest mb-2" htmlFor="username">
                USERNAME
              </label>
              <div className="relative group">
                <input 
                  type="text" 
                  id="username" 
                  className="w-full bg-[#181625] border border-[#2d2843] group-focus-within:border-purple-500/50 rounded-md p-3.5 text-sm font-mono text-gray-200 focus:outline-none transition-colors placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  placeholder="Username...."
                />
              </div>
            </div>
            
            <div className="mb-8">
              <label className="block text-[10px] font-mono font-bold text-gray-300 tracking-widest mb-2" htmlFor="password">
                PASSWORD
              </label>
              <div className="relative group">
                <input 
                  type="password" 
                  id="password" 
                  className="w-full bg-[#181625] border border-[#2d2843] group-focus-within:border-cyan-500/50 rounded-md p-3.5 text-sm font-mono text-gray-200 focus:outline-none transition-colors placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  placeholder="Password...."
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full font-mono font-bold text-sm text-white tracking-widest py-4 rounded-md transition-all duration-300 relative overflow-hidden group shadow-[0_5px_20px_rgba(100,50,250,0.3)] hover:shadow-[0_8px_25px_rgba(100,50,250,0.5)] transform hover:-translate-y-0.5"
            >
              <span className="relative z-10">LOGIN TO SYSTEM</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#8a2be2] via-[#5a38fd] to-[#00a2ff] z-0"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white z-0 transition-opacity duration-300"></div>
            </button>
          </form>
          
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 text-center w-full z-10">
        <p className="text-[10px] font-mono text-gray-600 tracking-widest">©2026 SIWEB KELOMPOK 11</p>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
    </div>
  );
}

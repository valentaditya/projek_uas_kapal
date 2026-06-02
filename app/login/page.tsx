"use client";

import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { UserIcon, LockClosedIcon, EnvelopeIcon, PhoneIcon, EyeIcon, EyeSlashIcon, ArrowLeftIcon} from '@heroicons/react/24/outline';
import { createClient } from '../../utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  React.useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
      return null;
    };
    
    const session = getCookie('session_user');
    if (session) {
      try {
        const user = JSON.parse(session);
        if (user.role === 'Admin') {
          router.replace('/admin/dashboard');
        } else {
          router.replace('/dashboard');
        }
      } catch (e) {
      }
    }
  }, [router]);


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement)?.value;

    Swal.fire({
      title: 'Sedang memproses...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });


    // cara connect db
    const supabase = createClient();
    

    const { data: userData, error } = await // cara ambil data user di db
 supabase.from('user').select('*')
      .or(`email.eq."${email}",username.eq."${email}"`)
      .maybeSingle();

    if (error || !userData) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Login Gagal",
        text: "Username/Email tidak terdaftar",
        showConfirmButton: false,
        timer: 2000,
        theme: 'auto'
      });
      return;
    }

    if (userData.password !== password) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Login Gagal",
        text: "Password yang Anda masukkan salah",
        showConfirmButton: false,
        timer: 2000,
        theme: 'auto'
      });
      return;
    }

    if (userData.status !== 'Aktif') {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Login Gagal",
        text: "Status akun Anda tidak aktif",
        showConfirmButton: false,
        timer: 2000,
        theme: 'auto'
      });
      return;
    }

    document.cookie = `session_user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=86400; SameSite=Lax`;

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

    if (userData.role === 'Admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };


  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const username = (e.currentTarget.elements.namedItem('username_reg') as HTMLInputElement)?.value;
    const email = (e.currentTarget.elements.namedItem('email_reg') as HTMLInputElement)?.value;
    const phone = (e.currentTarget.elements.namedItem('reg_telepon') as HTMLInputElement)?.value;
    const password = (e.currentTarget.elements.namedItem('password_reg') as HTMLInputElement)?.value;
    const repassword = (e.currentTarget.elements.namedItem('repassword_reg') as HTMLInputElement)?.value;

    if (password !== repassword) {
      Swal.fire({
        icon: "error",
        title: "Password tidak sama",
        text: "Pastikan password dan konfirmasi password sesuai",
        theme: "auto"
      });
      return;
    }

    Swal.fire({
      title: 'Mendaftarkan...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });


    // cara connect db
    const supabase = createClient();


    const { data: existingUser, error: checkError } = await // cara ambil data user di db
 supabase.from('user').select('id')
      .or(`email.eq."${email}",username.eq."${username}"`);

    if (checkError) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mendaftar",
        text: "Terjadi kesalahan saat memeriksa akun: " + checkError.message,
        theme: "auto"
      });
      return;
    }

    if (existingUser && existingUser.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mendaftar",
        text: "Username atau Email sudah terdaftar",
        theme: "auto"
      });
      return;
    }


    const { error: insertError } = await // cara memasukkan data ke db
 supabase.from('user').insert([
        {
          username: username,
          nama_lengkap: username,
          email: email,
          no_telepon: phone,
          password: password,
          role: 'User',
          status: 'Aktif'
        }
      ]);

    if (insertError) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mendaftar",
        text: insertError.message,
        theme: "auto"
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Berhasil Daftar!",
      text: "Akun berhasil dibuat. Silakan login.",
      timer: 3000,
      showConfirmButton: false,
      theme: "auto"
    });
    
    e.currentTarget.reset();
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen bg-[#0e0a1c] bg-radial flex flex-col items-center justify-center relative overflow-hidden" 
         style={{ background: 'radial-gradient(circle at center, #1b1236 0%, #0a0614 100%)' }}>
    
      <div className="w-full max-w-[400px] mb-4 z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium font-mono">
          <ArrowLeftIcon className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      <div className="w-full max-w-[400px] bg-[#12111d] rounded-xl border-t border-purple-500/30 border-b border-b-cyan-500/20 shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)] overflow-hidden relative z-10" style={{ boxShadow: '0 0 30px 10px rgba(100, 50, 200, 0.1), inset 0 0 15px rgba(255,255,255,0.02)' }}>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        
        <div className="p-10 flex flex-col items-center">
          
          <div className="mb-6 relative">
            <Image 
                src="/profile/icon.png" 
                alt="Logo Kapal" 
                width={100} 
                height={100} 
                className="object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" 
              />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-500 rounded-full blur-[30px] opacity-20"></div>
          </div>
          
          <div className="text-center mb-2 font-black tracking-widest text-2xl flex gap-2 justify-center">
           <span className='text-white'>Masuk Ke Sistem</span>
          </div>

          <div className="text-center mb-6">
            <h2 className="font-mono text-[11px] font-bold text-gray-300 tracking-wider">
              Sistem Manajemen Armada Anagata Oceanics
            </h2>
          </div>

          <div className="flex w-full bg-[#1a1c29]/80 rounded-lg p-1 mb-8 shadow-inner border border-white/5">
            <button 
              type="button" 
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'login' ? 'bg-purple-500 text-white shadow-sm cursor-default' : 'text-gray-400 hover:text-white'}`}
            >
              Masuk
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'register' ? 'bg-purple-500 text-white shadow-sm cursor-default' : 'text-gray-400 hover:text-white'}`}
            >
              Buat Akun
            </button>
          </div>
          
          <form key={activeTab} className="w-full" onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
            {activeTab === 'login' ? (
              <>
                <div className="mb-5">
                  <label className="block text-[10px] font-mono font-bold text-gray-300 tracking-widest mb-2" htmlFor="email">
                    EMAIL
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full bg-[#181625] border border-[#2d2843] group-focus-within:border-purple-500/50 rounded-md py-3.5 pr-3.5 pl-10 text-sm font-mono text-gray-200 focus:outline-none transition-colors placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                      placeholder="contoh@email.com"
                    />
                  </div>
                </div>
                
                <div className="mb-8">
                  <label className="block text-[10px] font-mono font-bold text-gray-300 tracking-widest mb-2" htmlFor="password">
                    PASSWORD
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    </div>

                    <input 
                      type={showRePassword ? "text" : "password"}
                      id="password"
                      required 
                      className="w-full bg-[#181625] border border-[#2d2843] group-focus-within:border-cyan-500/50 rounded-md py-3.5 pr-10 pl-10 text-sm font-mono text-gray-200 focus:outline-none transition-colors placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                      placeholder="Masukan Password"
                    />
                  
                    <div 
                      onClick={() => setShowRePassword(!showRePassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                      {showRePassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                      )}
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full font-mono font-bold text-sm text-white tracking-widest py-4 rounded-md transition-all duration-300 relative overflow-hidden group shadow-[0_5px_20px_rgba(100,50,250,0.3)] hover:shadow-[0_8px_25px_rgba(100,50,250,0.5)] transform hover:-translate-y-0.5"
                >
                  <span className="relative z-10">MASUK KE SISTEM</span>
                  <div className="absolute inset-0 bg-purple-500 z-0"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white z-0 transition-opacity duration-300"></div>
                </button>
              </>
            ) : (
              <>
                <div className="mb-5">
                  
                  <label className="block text-[10px] font-mono font-bold text-gray-300 tracking-widest mb-2" htmlFor="username_reg">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input 
                      type="text" 
                      id="username_reg" 
                      required
                      className="w-full bg-[#181625] border border-[#2d2843] group-focus-within:border-purple-500/50 rounded-md py-3.5 pr-3.5 pl-10 text-sm font-mono text-gray-200 focus:outline-none transition-colors placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                      placeholder="Pilih username"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-[10px] font-mono font-bold text-gray-300 tracking-widest mb-2" htmlFor="email_reg">
                    Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input 
                      type="email" 
                      id="email_reg"
                      required 
                      className="w-full bg-[#181625] border border-[#2d2843] group-focus-within:border-cyan-500/50 rounded-md py-3.5 pr-3.5 pl-10 text-sm font-mono text-gray-200 focus:outline-none transition-colors placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                
                <div className="mb-5">
                  <label className="block text-[10px] font-mono font-bold text-gray-300 tracking-widest mb-2" htmlFor="reg_telepon">
                    No Telepon
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input 
                      type="number" 
                      id="reg_telepon"
                      required 
                      className="w-full bg-[#181625] border border-[#2d2843] group-focus-within:border-cyan-500/50 rounded-md py-3.5 pr-3.5 pl-10 text-sm font-mono text-gray-200 focus:outline-none transition-colors placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                      placeholder="+62 812-3456-7890"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-[10px] font-mono font-bold text-gray-300 tracking-widest mb-2" htmlFor="password_reg">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    </div>

                    <input 
                      type={showPassword ? "text" : "password"}
                      id="password_reg"
                      required 
                      className="w-full bg-[#181625] border border-[#2d2843] group-focus-within:border-cyan-500/50 rounded-md py-3.5 pr-10 pl-10 text-sm font-mono text-gray-200 focus:outline-none transition-colors placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                      placeholder="Minimal 6 Karakter"
                    />

                    <div 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-[10px] font-mono font-bold text-gray-300 tracking-widest mb-2" htmlFor="repassword_reg">
                    Konfirmasi Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    </div>

                    <input 
                      type={showRePassword ? "text" : "password"}
                      id="repassword_reg"
                      required 
                      className="w-full bg-[#181625] border border-[#2d2843] group-focus-within:border-cyan-500/50 rounded-md py-3.5 pr-10 pl-10 text-sm font-mono text-gray-200 focus:outline-none transition-colors placeholder:text-gray-600 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                      placeholder="Ulangi password"
                    />
                  
                    <div 
                      onClick={() => setShowRePassword(!showRePassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                      {showRePassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white" />
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full font-mono font-bold text-sm text-white tracking-widest py-4 rounded-md transition-all duration-300 relative overflow-hidden group shadow-[0_5px_20px_rgba(100,50,250,0.3)] hover:shadow-[0_8px_25px_rgba(100,50,250,0.5)] transform hover:-translate-y-0.5"
                >
                  <span className="relative z-10">BUAT AKUN</span>
                  <div className="absolute inset-0 bg-purple-500 z-0"></div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white z-0 transition-opacity duration-300"></div>
                </button>
              </>
            )}
          </form>
          
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
    </div>
  );
}

"use client";

import { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  ShieldCheckIcon, 
  PencilSquareIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { createClient } from '../../../utils/supabase/client';

export default function ProfilPage() {
  const [user, setUser] = useState<any>({
    nama_lengkap: 'Customer User',
    email: 'customer.user@email.com',
    no_telepon: '+62 812 3456 7890',
    alamat: 'Jakarta, Indonesia',
    perusahaan: 'PT. Example Company'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({
    total: 0,
    proses: 0,
    selesai: 0
  });

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
      return null;
    };

    const fetchUserStats = async (userId: number) => {
      // cara connect db
      const supabase = createClient();
      try {
        const { data, error } = await // cara ambil data di db
 supabase.from('detail_pengiriman').select('id_pengiriman, pengiriman(status)')
          .eq('id_user', userId);

        if (data && !error) {
          const total = data.length;
          const proses = data.filter((d: any) => 
            d.pengiriman && (d.pengiriman.status === 'Menunggu Persetujuan' || d.pengiriman.status === 'Disetujui' || d.pengiriman.status === 'Dalam Perjalanan' || d.pengiriman.status === 'Kirim')
          ).length;
          const selesai = data.filter((d: any) => d.pengiriman && d.pengiriman.status === 'Terkirim').length;

          setStats({ total, proses, selesai });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    const session = getCookie('session_user');
    if (session) {
      try {
        const parsedUser = JSON.parse(session);
        setUser(parsedUser);
        if (parsedUser?.id) {
          fetchUserStats(parsedUser.id);
        }
      } catch (e) {
        console.error("Error parsing user session:", e);
      }
    }
  }, []);

  const handleEditClick = () => {
    setFormData({ ...user });
    setErrors({});
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.nama_lengkap?.trim()) newErrors.nama_lengkap = 'Nama Lengkap wajib diisi';
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.no_telepon?.trim()) {
      newErrors.no_telepon = 'No. Telepon wajib diisi';
    } else if (!/^\+?[0-9]+$/.test(formData.no_telepon)) {
      newErrors.no_telepon = 'Hanya boleh berisi angka';
    } else {
      const digits = formData.no_telepon.trim().replace(/\+/g, '');
      if (digits.length < 8 || digits.length > 12) {
        newErrors.no_telepon = 'No. Telepon harus minimal 8 dan maksimal 12 digit';
      }
    }
    
    if (!formData.alamat?.trim()) newErrors.alamat = 'Alamat wajib diisi';
    if (!formData.perusahaan?.trim()) newErrors.perusahaan = 'Perusahaan wajib diisi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    Swal.fire({
      title: 'Menyimpan perubahan...',
      allowOutsideClick: false,
      theme: 'dark',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // cara connect db
    const supabase = createClient();
    
    const { error } = await // cara perbarui data di db
 supabase.from('user').update({
        nama_lengkap: formData.nama_lengkap,
        email: formData.email,
        no_telepon: formData.no_telepon,
        alamat: formData.alamat,
        perusahaan: formData.perusahaan
      })
      .eq('id', user.id);

    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        theme: 'dark',
        text: error.message
      });
      return;
    }

    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
    document.cookie = `session_user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=86400; SameSite=Lax`;
    setIsEditing(false);

    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      theme: 'dark',
      text: 'Profil berhasil diperbarui!',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPassErrors: Record<string, string> = {};
    if (!passwordForm.oldPassword) {
      newPassErrors.oldPassword = 'Password lama wajib diisi';
    }
    
    if (!passwordForm.newPassword) {
      newPassErrors.newPassword = 'Password baru wajib diisi';
    } else if (passwordForm.newPassword.length < 6) {
      newPassErrors.newPassword = 'Password baru minimal harus 6 karakter!';
    }
    
    if (!passwordForm.confirmNewPassword) {
      newPassErrors.confirmNewPassword = 'Konfirmasi password baru wajib diisi';
    } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      newPassErrors.confirmNewPassword = 'Konfirmasi password baru tidak cocok!';
    }

    if (Object.keys(newPassErrors).length > 0) {
      setPasswordErrors(newPassErrors);
      const firstErrorField = Object.keys(newPassErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setPasswordErrors({});

    Swal.fire({
      title: 'Memproses ganti password...',
      theme: 'dark',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // cara connect db
    const supabase = createClient();

    try {

      const { data: userData, error: fetchError } = await // cara ambil data user di db
 supabase.from('user').select('password')
        .eq('id', user.id)
        .single();

      if (fetchError || !userData) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          theme: 'dark',
          text: 'Gagal mengambil data user: ' + (fetchError?.message || 'User tidak ditemukan')
        });
        return;
      }


      if (userData.password !== passwordForm.oldPassword) {
        setPasswordErrors({ oldPassword: 'Password lama yang dimasukkan salah!' });
        Swal.close();
        return;
      }


      const { error: updateError } = await // cara perbarui data di db
 supabase.from('user').update({ password: passwordForm.newPassword })
        .eq('id', user.id);

      if (updateError) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          theme: 'dark',
          text: 'Gagal memperbarui password: ' + updateError.message
        });
        return;
      }


      const updatedUser = { ...user, password: passwordForm.newPassword };
      setUser(updatedUser);
      document.cookie = `session_user=${encodeURIComponent(JSON.stringify(updatedUser))}; path=/; max-age=86400; SameSite=Lax`;
      
      setIsChangingPassword(false);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Password berhasil diperbarui!',
        timer: 2000,
        theme: 'dark',
        showConfirmButton: false
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        theme: 'dark',
        text: 'Terjadi kesalahan: ' + err.message
      });
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 relative z-10 w-full space-y-6 flex-1">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Profil Pengguna</h2>
          <p className="text-gray-400 text-xs tracking-wider">Kelola informasi akun Anda</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          
          <button 
            onClick={() => {
              setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
              setPasswordErrors({});
              setIsChangingPassword(true);
            }}
            className="bg-transparent border border-[#b06aee] hover:bg-[#b06aee]/10 text-[#b06aee] px-5 py-2.5 rounded-md transition-all font-bold text-xs tracking-wider flex items-center gap-2"
          >
            Ganti Password
          </button>
          
          <button 
            onClick={handleEditClick}
            className="bg-[#b06aee] hover:bg-[#9a54d6] text-white px-5 py-2.5 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all font-bold text-xs tracking-wider flex items-center gap-2"
          >
            <PencilSquareIcon className="w-4 h-4" /> Edit Profil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-[#151922] border border-white/5 rounded-lg p-8 flex flex-col items-center justify-center relative overflow-hidden lg:col-span-1 min-h-[300px]">
          <div className="w-20 h-20 rounded-full bg-[#1e1a2b] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-[#b06aee]/30">
            <UserIcon className="w-10 h-10 text-[#b06aee]" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-wider mb-2">{user.nama_lengkap || user.username}</h3>
          <p className="text-xs text-gray-500 font-mono tracking-tight mb-6">{user.email}</p>
          {/* <div className="flex items-center gap-2 text-[#10b981]">
            <ShieldCheckIcon className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wider uppercase">User Terverifikasi</span>
          </div> */}
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-lg p-8 flex flex-col relative overflow-hidden lg:col-span-2 min-h-[300px]">
          <h3 className="text-sm font-bold text-white tracking-wider mb-6">Informasi Detail</h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <UserIcon className="w-4 h-4 text-[#b06aee] mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Nama Lengkap</p>
                <p className="text-xs text-white font-semibold font-mono tracking-tight">{user.nama_lengkap}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <EnvelopeIcon className="w-4 h-4 text-[#3b82f6] mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Email</p>
                <p className="text-xs text-white font-semibold font-mono tracking-tight">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <PhoneIcon className="w-4 h-4 text-[#10b981] mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 mb-1">No. Telepon</p>
                <p className="text-xs text-white font-semibold font-mono tracking-tight">{user.no_telepon}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPinIcon className="w-4 h-4 text-[#10b981] mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Alamat</p>
                <p className="text-xs text-white font-semibold font-mono tracking-tight">{user.alamat || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <BuildingOfficeIcon className="w-4 h-4 text-[#b06aee] mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Perusahaan</p>
                <p className="text-xs text-white font-semibold font-mono tracking-tight">{user.perusahaan || '-'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="bg-[#151922] border border-white/5 rounded-lg p-5 relative overflow-hidden">
          <p className="text-[10px] text-gray-400 mb-2 font-mono">Total Pengiriman</p>
          <p className="text-3xl font-black text-[#b06aee]">{stats.total}</p>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-lg p-5 relative overflow-hidden">
          <p className="text-[10px] text-gray-400 mb-2 font-mono">Dalam Proses</p>
          <p className="text-3xl font-black text-[#3b82f6]">{stats.proses}</p>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-lg p-5 relative overflow-hidden">
          <p className="text-[10px] text-gray-400 mb-2 font-mono">Selesai</p>
          <p className="text-3xl font-black text-[#10b981]">{stats.selesai}</p>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151922] border border-white/10 rounded-lg w-full max-w-md p-6 relative">
            
            <button 
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-bold text-white mb-6 tracking-wider">Edit Profil</h3>
            
            <form onSubmit={handleSave} noValidate className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="nama_lengkap"
                  id="nama_lengkap"
                  value={formData.nama_lengkap || ''}
                  onChange={e => {
                    handleChange(e);
                    if (errors.nama_lengkap) setErrors({...errors, nama_lengkap: ''});
                  }}
                  className={`w-full bg-[#1e1a2b] border rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors ${
                    errors.nama_lengkap 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-white/10 focus:border-[#b06aee]'
                  }`}
                />
                {errors.nama_lengkap && <p className="text-red-500 text-xs mt-1">{errors.nama_lengkap}</p>}
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Email</label>
                <input 
                  type="email" 
                  name="email"
                  id="email"
                  value={formData.email || ''}
                  onChange={e => {
                    handleChange(e);
                    if (errors.email) setErrors({...errors, email: ''});
                  }}
                  className={`w-full bg-[#1e1a2b] border rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-white/10 focus:border-[#b06aee]'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">No. Telepon</label>
                <input 
                  type="text" 
                  name="no_telepon"
                  id="no_telepon"
                  value={formData.no_telepon || ''}
                  onChange={e => {
                    handleChange(e);
                    if (errors.no_telepon) setErrors({...errors, no_telepon: ''});
                  }}
                  placeholder="Contoh: 08123456789 (8-12 digit)"
                  className={`w-full bg-[#1e1a2b] border rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors ${
                    errors.no_telepon 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-white/10 focus:border-[#b06aee]'
                  }`}
                />
                {errors.no_telepon && <p className="text-red-500 text-xs mt-1">{errors.no_telepon}</p>}
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Alamat</label>
                <input 
                  type="text" 
                  name="alamat"
                  id="alamat"
                  value={formData.alamat || ''}
                  onChange={e => {
                    handleChange(e);
                    if (errors.alamat) setErrors({...errors, alamat: ''});
                  }}
                  placeholder="Contoh: Jl. Merdeka No. 123, Jakarta"
                  className={`w-full bg-[#1e1a2b] border rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors ${
                    errors.alamat 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-white/10 focus:border-[#b06aee]'
                  }`}
                />
                {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Perusahaan</label>
                <input 
                  type="text" 
                  name="perusahaan"
                  id="perusahaan"
                  value={formData.perusahaan || ''}
                  onChange={e => {
                    handleChange(e);
                    if (errors.perusahaan) setErrors({...errors, perusahaan: ''});
                  }}
                  className={`w-full bg-[#1e1a2b] border rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors ${
                    errors.perusahaan 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-white/10 focus:border-[#b06aee]'
                  }`}
                />
                {errors.perusahaan && <p className="text-red-500 text-xs mt-1">{errors.perusahaan}</p>}
              </div>
 
              <div className="flex justify-end gap-3 mt-6">
                
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded text-xs font-bold tracking-wider text-gray-400 hover:text-white transition-colors"
                >
                  Batal
                </button>
                
                <button 
                  type="submit"
                  className="bg-[#b06aee] hover:bg-[#9a54d6] text-white px-4 py-2 rounded shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all text-xs font-bold tracking-wider"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isChangingPassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151922] border border-white/10 rounded-lg w-full max-w-md p-6 relative">
            
            <button 
              onClick={() => setIsChangingPassword(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-bold text-white mb-6 tracking-wider">Ganti Password</h3>
            
            <form onSubmit={handlePasswordChangeSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Password Lama</label>
                <input 
                  type="password" 
                  id="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={e => {
                    setPasswordForm({ ...passwordForm, oldPassword: e.target.value });
                    if (passwordErrors.oldPassword) setPasswordErrors({...passwordErrors, oldPassword: ''});
                  }}
                  className={`w-full bg-[#1e1a2b] border rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors ${
                    passwordErrors.oldPassword 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-white/10 focus:border-[#b06aee]'
                  }`}
                  placeholder="Masukkan password lama"
                />
                {passwordErrors.oldPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.oldPassword}</p>}
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Password Baru</label>
                <input 
                  type="password" 
                  id="newPassword"
                  value={passwordForm.newPassword}
                  onChange={e => {
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                    if (passwordErrors.newPassword) setPasswordErrors({...passwordErrors, newPassword: ''});
                  }}
                  className={`w-full bg-[#1e1a2b] border rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors ${
                    passwordErrors.newPassword 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-white/10 focus:border-[#b06aee]'
                  }`}
                  placeholder="Masukkan password baru (min 6 karakter)"
                />
                {passwordErrors.newPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>}
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Ulangi Password Baru</label>
                <input 
                  type="password" 
                  id="confirmNewPassword"
                  value={passwordForm.confirmNewPassword}
                  onChange={e => {
                    setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value });
                    if (passwordErrors.confirmNewPassword) setPasswordErrors({...passwordErrors, confirmNewPassword: ''});
                  }}
                  className={`w-full bg-[#1e1a2b] border rounded px-3 py-2 text-sm text-white focus:outline-none transition-colors ${
                    passwordErrors.confirmNewPassword 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-white/10 focus:border-[#b06aee]'
                  }`}
                  placeholder="Ulangi password baru"
                />
                {passwordErrors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmNewPassword}</p>}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                
                <button 
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 rounded text-xs font-bold tracking-wider text-gray-400 hover:text-white transition-colors"
                >
                  Batal
                </button>
                
                <button 
                  type="submit"
                  className="bg-[#b06aee] hover:bg-[#9a54d6] text-white px-4 py-2 rounded shadow-[0_0_10px_rgba(168,85,247,0.4)] transition-all text-xs font-bold tracking-wider"
                >
                  Ganti Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

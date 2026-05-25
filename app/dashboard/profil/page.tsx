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
  const [formData, setFormData] = useState<any>({});
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
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from('detail_pengiriman')
          .select('id_pengiriman, pengiriman(status)')
          .eq('id_user', userId);

        if (data && !error) {
          const total = data.length;
          const proses = data.filter((d: any) => 
            d.pengiriman && (d.pengiriman.status === 'Menunggu Persetujuan' || d.pengiriman.status === 'Disetujui' || d.pengiriman.status === 'Dalam Perjalanan')
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
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    Swal.fire({
      title: 'Menyimpan perubahan...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const supabase = createClient();
    
    const { error } = await supabase
      .from('user')
      .update({
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

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 relative z-10 w-full space-y-6 flex-1">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Profil Pengguna</h2>
          <p className="text-gray-400 text-xs tracking-wider">Kelola informasi akun Anda</p>
        </div>
        <button 
          onClick={handleEditClick}
          className="bg-[#b06aee] hover:bg-[#9a54d6] text-white px-5 py-2.5 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all font-bold text-xs tracking-wider flex items-center gap-2 mt-4 md:mt-0"
        >
          <PencilSquareIcon className="w-4 h-4" /> Edit Profil
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-[#151922] border border-white/5 rounded-lg p-8 flex flex-col items-center justify-center relative overflow-hidden lg:col-span-1 min-h-[300px]">
          <div className="w-20 h-20 rounded-full bg-[#1e1a2b] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-[#b06aee]/30">
            <UserIcon className="w-10 h-10 text-[#b06aee]" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-wider mb-2">{user.nama_lengkap || user.username}</h3>
          <p className="text-xs text-gray-500 font-mono tracking-tight mb-6">{user.email}</p>
          <div className="flex items-center gap-2 text-[#10b981]">
            <ShieldCheckIcon className="w-4 h-4" />
            <span className="text-xs font-bold tracking-wider uppercase">User Terverifikasi</span>
          </div>
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
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="nama_lengkap"
                  value={formData.nama_lengkap || ''}
                  onChange={handleChange}
                  className="w-full bg-[#1e1a2b] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b06aee] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full bg-[#1e1a2b] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b06aee] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">No. Telepon</label>
                <input 
                  type="text" 
                  name="no_telepon"
                  value={formData.no_telepon || ''}
                  onChange={handleChange}
                  className="w-full bg-[#1e1a2b] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b06aee] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Alamat</label>
                <input 
                  type="text" 
                  name="alamat"
                  value={formData.alamat || ''}
                  onChange={handleChange}
                  className="w-full bg-[#1e1a2b] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b06aee] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Perusahaan</label>
                <input 
                  type="text" 
                  name="perusahaan"
                  value={formData.perusahaan || ''}
                  onChange={handleChange}
                  className="w-full bg-[#1e1a2b] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b06aee] transition-colors"
                  required
                />
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
    </main>
  );
}

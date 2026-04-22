"use client";

import { useState } from 'react';
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

export default function ProfilPage() {
  const [user, setUser] = useState({
    name: 'Customer User',
    email: 'customer.user@email.com',
    phone: '+62 812 3456 7890',
    address: 'Jakarta, Indonesia',
    company: 'PT. Example Company'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleEditClick = () => {
    setFormData(user);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);
    setIsEditing(false);
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
          <h3 className="text-lg font-bold text-white tracking-wider mb-2">{user.name}</h3>
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
                <p className="text-xs text-white font-semibold font-mono tracking-tight">{user.name}</p>
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
                <p className="text-xs text-white font-semibold font-mono tracking-tight">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPinIcon className="w-4 h-4 text-[#10b981] mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Alamat</p>
                <p className="text-xs text-white font-semibold font-mono tracking-tight">{user.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <BuildingOfficeIcon className="w-4 h-4 text-[#b06aee] mt-0.5" />
              <div>
                <p className="text-[10px] text-gray-400 mb-1">Perusahaan</p>
                <p className="text-xs text-white font-semibold font-mono tracking-tight">{user.company}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="bg-[#151922] border border-white/5 rounded-lg p-5 relative overflow-hidden">
          <p className="text-[10px] text-gray-400 mb-2 font-mono">Total Pengiriman</p>
          <p className="text-3xl font-black text-[#b06aee]">12</p>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-lg p-5 relative overflow-hidden">
          <p className="text-[10px] text-gray-400 mb-2 font-mono">Dalam Proses</p>
          <p className="text-3xl font-black text-[#3b82f6]">3</p>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-lg p-5 relative overflow-hidden">
          <p className="text-[10px] text-gray-400 mb-2 font-mono">Selesai</p>
          <p className="text-3xl font-black text-[#10b981]">9</p>
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
                  name="name"
                  value={formData.name}
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
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#1e1a2b] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b06aee] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">No. Telepon</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#1e1a2b] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b06aee] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Alamat</label>
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-[#1e1a2b] border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b06aee] transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-400 mb-1 font-mono">Perusahaan</label>
                <input 
                  type="text" 
                  name="company"
                  value={formData.company}
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

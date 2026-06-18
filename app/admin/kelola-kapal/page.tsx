"use client";

import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import Swal from 'sweetalert2';

// cara connect db
const supabase = createClient();

const ShipIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
    <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
    <path d="M12 10v4" />
    <path d="M12 2v3" />
  </svg>
);

export default function KelolaKapalPage() {
  const [ships, setShips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShip, setEditingShip] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '', type: '', kapten: '', tujuan: '', region: '', status: '', fuel: '100'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchKapal = async () => {
    try {
      const { data, error } = await // cara ambil data di db
 supabase.from('kapal').select('*')
        .order('id', { ascending: false });

      if (data && !error) {
        const formattedData = data.map(ship => {
          let statusColor = 'text-gray-500';
          let statusBg = 'bg-gray-500/10';
          const s = (ship.status_kapal || '').toLowerCase();
          
          if (s.includes('route')) { 
            statusColor = 'text-[#3b82f6]'; 
            statusBg = 'bg-[#3b82f6]/10'; 
          } else if (s.includes('port')) { 
            statusColor = 'text-[#10b981]'; 
            statusBg = 'bg-[#10b981]/10'; 
          } else if (s.includes('delay')) { 
            statusColor = 'text-[#eab308]'; 
            statusBg = 'bg-[#eab308]/10'; 
          } else if (s.includes('maintenance')) { 
            statusColor = 'text-[#f97316]'; 
            statusBg = 'bg-[#f97316]/10'; 
          } else { 
            statusColor = 'text-[#b06aee]'; 
            statusBg = 'bg-[#b06aee]/10'; 
          }

          const rawFuel = ship.fuel_kapal;
          const fuelText = rawFuel !== null && rawFuel !== undefined ? `${rawFuel}%` : '0%';

          return {
            id: ship.id,
            name: ship.nama_kapal || '',
            type: ship.tipe_kapal || '',
            kapten: ship.nama_kapten || '',
            tujuan: ship.tujuan_kapal || '',
            region: ship.region_kapal || '',
            status: ship.status_kapal || '',
            fuel: fuelText,
            statusColor,
            statusBg
          };
        });
        setShips(formattedData);
      } else if (error) {
        console.error("Error fetching kapal:", error);
      }
    } catch (e) {
      console.error("Failed to fetch kapal:", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchKapal();
  }, [supabase]);

  const getIndonesianStatus = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('route') || s.includes('berlayar')) return 'Sedang Berlayar';
    if (s.includes('port') || s.includes('pelabuhan')) return 'Di Pelabuhan';
    if (s.includes('delay') || s.includes('tunda')) return 'Tertunda';
    if (s.includes('maintenance') || s.includes('pelihara') || s.includes('perbaikan')) return 'Pemeliharaan';
    return status;
  };

  const filteredShips = ships.filter(ship => 
    (ship.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (ship.kapten || '').toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingShip(null);
    setFormData({ name: '', type: '', kapten: '', tujuan: '', region: '', status: '', fuel: '100' });
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (ship: any) => {
    setEditingShip(ship);
    const fuelVal = (ship.fuel || '').replace('%', '');
    setFormData({
      name: ship.name,
      type: ship.type,
      kapten: ship.kapten,
      tujuan: ship.tujuan,
      region: ship.region,
      status: ship.status,
      fuel: fuelVal
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Nama Kapal wajib diisi';
    if (!formData.type.trim()) newErrors.type = 'Tipe Kapal wajib diisi';
    if (!formData.kapten.trim()) newErrors.kapten = 'Nama Kapten wajib diisi';
    if (!formData.tujuan.trim()) newErrors.tujuan = 'Tujuan wajib diisi';
    if (!formData.region.trim()) newErrors.region = 'Region wajib diisi';
    if (!formData.status) newErrors.status = 'Status wajib dipilih';
    
    if (!formData.fuel) {
      newErrors.fuel = 'Fuel wajib diisi';
    } else if (!/^\d+(\.\d+)?$/.test(formData.fuel)) {
      newErrors.fuel = 'Cuma bisa angka';
    } else {
      const fuelVal = parseFloat(formData.fuel);
      if (fuelVal < 0 || fuelVal > 100) {
        newErrors.fuel = 'Fuel harus di antara 0 dan 100';
      }
    }

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
      title: editingShip ? 'Memperbarui Kapal...' : 'Menambahkan Kapal...',
      allowOutsideClick: false,
      theme: 'dark',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const payload = {
      nama_kapal: formData.name,
      tipe_kapal: formData.type,
      nama_kapten: formData.kapten,
      tujuan_kapal: formData.tujuan,
      region_kapal: formData.region,
      status_kapal: formData.status,
      fuel_kapal: parseFloat(formData.fuel) || 0
    };

    if (editingShip) {
      const { error } = await // cara perbarui data di db
 supabase.from('kapal').update(payload)
        .eq('id', editingShip.id);

      if (!error) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data kapal berhasil diperbarui.',
          timer: 1500,
          theme: 'dark',
          showConfirmButton: false
        });
        fetchKapal();
        setIsModalOpen(false);
        setEditingShip(null);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal memperbarui data: ' + error.message,
          theme: 'dark'
        });
      }
    } else {
      const { error } = await // cara memasukkan data ke db
 supabase.from('kapal').insert([payload]);

      if (!error) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kapal baru berhasil ditambahkan.',
          timer: 1500,
          theme: 'dark',
          showConfirmButton: false
        });
        fetchKapal();
        setIsModalOpen(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          theme: 'dark',
          text: 'Gagal menambahkan kapal: ' + error.message
        });
      }
    }
  };

  const deleteShip = async (ship: any) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Hapus kapal ${ship.name}? Tindakan ini tidak dapat dibatalkan!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      theme: 'dark'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Menghapus Kapal...',
        allowOutsideClick: false,
        theme: 'dark',
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const { error } = await // cara hapus data di db
 supabase.from('kapal').delete()
        .eq('id', ship.id);

      if (!error) {
        Swal.fire({
          icon: 'success',
          title: 'Dihapus!',
          text: 'Data kapal berhasil dihapus.',
          theme: 'dark',
          timer: 1500,
          showConfirmButton: false
        });
        fetchKapal();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          theme: 'dark',
          text: 'Gagal menghapus data: ' + error.message
        });
      }
    }
  };

  return (
    <main className="mx-auto px-6 py-10 relative z-10 w-full max-w-[1500px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Kelola Data Kapal</h2>
          <p className="text-gray-400 text-xs tracking-wider">Manajemen lengkap armada kapal</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#b06aee] hover:bg-[#9a54d6] text-white px-4 py-2 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all font-bold text-xs tracking-wider flex items-center gap-2"
        >
          + Tambah Kapal
        </button>
      </div>

      <div className="mb-8 relative w-full">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          type="text"
          placeholder="Cari nama kapal atau kapten..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#151922] border border-white/5 rounded-md pl-12 pr-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all placeholder:text-gray-600"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="bg-[#151922] border border-white/5 rounded-[10px] p-6 flex flex-col h-full min-h-[220px] justify-between">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded bg-white/5 animate-pulse shrink-0" />
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-white/5 animate-pulse rounded" />
                  <div className="w-16 h-3 bg-white/5 animate-pulse rounded" />
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-center">
                  <div className="w-12 h-3.5 bg-white/5 animate-pulse rounded" />
                  <div className="w-24 h-3.5 bg-white/5 animate-pulse rounded" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-12 h-3.5 bg-white/5 animate-pulse rounded" />
                  <div className="w-20 h-3.5 bg-white/5 animate-pulse rounded" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-12 h-3.5 bg-white/5 animate-pulse rounded" />
                  <div className="w-16 h-3.5 bg-white/5 animate-pulse rounded" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-10 h-3.5 bg-white/5 animate-pulse rounded" />
                  <div className="w-12 h-3.5 bg-white/5 animate-pulse rounded" />
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="w-16 h-5 bg-white/5 animate-pulse rounded" />
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded bg-white/5 animate-pulse" />
                  <div className="w-7 h-7 rounded bg-white/5 animate-pulse" />
                </div>
              </div>
            </div>
          ))
        ) : filteredShips.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500 font-mono">
            Tidak ada kapal ditemukan.
          </div>
        ) : (
          filteredShips.map((ship, idx) => (
            <div key={ship.id || idx} className="bg-[#151922] border border-white/5 rounded-[10px] p-6 flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded bg-[#b06aee]/10 flex items-center justify-center border border-[#b06aee]/20 shrink-0">
                  <ShipIcon className="w-4 h-4 text-[#b06aee]" />
                </div>
                <div>
                  <h3 className="text-gray-200 font-bold tracking-wide text-xs">{ship.name}</h3>
                  <p className="text-[10px] text-gray-500">{ship.type}</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <span>Kapten:</span>
                  <span className="text-gray-200 font-mono tracking-tight font-medium text-right max-w-[130px] truncate">{ship.kapten}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <span>Tujuan:</span>
                  <span className="text-gray-200 font-mono tracking-tight font-medium">{ship.tujuan}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <span>Region:</span>
                  <span className="text-gray-200 font-mono tracking-tight font-medium">{ship.region}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-400">
                  <span>Fuel:</span>
                  <span className="text-gray-200 font-mono tracking-tight font-medium">{ship.fuel}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className={`px-2 py-1 rounded text-[10px] font-semibold flex-shrink-0 ${ship.statusBg} ${ship.statusColor}`}>
                  {getIndonesianStatus(ship.status)}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEditModal(ship)} className="p-1.5 text-gray-400 hover:text-[#b06aee] transition-colors rounded hover:bg-white/5">
                    <PencilSquareIcon className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteShip(ship)} className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors rounded hover:bg-white/5">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151922] border border-white/5 rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-xl font-bold tracking-wider text-white">
                {editingShip ? 'Edit Data Kapal' : 'Tambah Kapal Baru'}
              </h3>
            </div>
            
            <form onSubmit={handleAddSubmit} noValidate className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nama Kapal *</label>
                  <input 
                    type="text" 
                    id="name"
                    value={formData.name} onChange={e => {
                      setFormData({...formData, name: e.target.value});
                      if (errors.name) setErrors({...errors, name: ''});
                    }}
                    className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 ${
                      errors.name 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Tipe Kapal *</label>
                  <input 
                    type="text" 
                    id="type"
                    value={formData.type} onChange={e => {
                      setFormData({...formData, type: e.target.value});
                      if (errors.type) setErrors({...errors, type: ''});
                    }}
                    className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 ${
                      errors.type 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                    }`}
                  />
                  {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nama Kapten *</label>
                  <input 
                    type="text" 
                    placeholder="Kapten..."
                    id="kapten"
                    value={formData.kapten} onChange={e => {
                      setFormData({...formData, kapten: e.target.value});
                      if (errors.kapten) setErrors({...errors, kapten: ''});
                    }}
                    className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 placeholder:text-gray-600 ${
                      errors.kapten 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                    }`}
                  />
                  {errors.kapten && <p className="text-red-500 text-xs mt-1">{errors.kapten}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Tujuan *</label>
                  <input 
                    type="text" 
                    id="tujuan"
                    value={formData.tujuan} onChange={e => {
                      setFormData({...formData, tujuan: e.target.value});
                      if (errors.tujuan) setErrors({...errors, tujuan: ''});
                    }}
                    className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 ${
                      errors.tujuan 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                    }`}
                  />
                  {errors.tujuan && <p className="text-red-500 text-xs mt-1">{errors.tujuan}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Region *</label>
                  <input 
                    type="text" 
                    id="region"
                    value={formData.region} onChange={e => {
                      setFormData({...formData, region: e.target.value});
                      if (errors.region) setErrors({...errors, region: ''});
                    }}
                    className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 ${
                      errors.region 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                    }`}
                  />
                  {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Status *</label>
                  <div className="relative">
                    <select 
                      id="status"
                      value={formData.status} 
                      onChange={e => {
                        setFormData({...formData, status: e.target.value});
                        if (errors.status) setErrors({...errors, status: ''});
                      }}
                      className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 appearance-none cursor-pointer ${
                        errors.status 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                      }`}
                    >
                      <option value="" disabled>Pilih Status</option>
                      <option value="En Route">Sedang Berlayar</option>
                      <option value="In Port">Di Pelabuhan</option>
                      <option value="Delayed">Tertunda</option>
                      <option value="Maintenance">Pemeliharaan</option>
                    </select>
                    
                  </div>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Fuel (%) *</label>
                  <input 
                    type="text" 
                    id="fuel"
                    value={formData.fuel} onChange={e => {
                      setFormData({...formData, fuel: e.target.value});
                      if (errors.fuel) setErrors({...errors, fuel: ''});
                    }}
                    className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 ${
                      errors.fuel 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                    }`}
                  />
                  {errors.fuel && <p className="text-red-500 text-xs mt-1">{errors.fuel}</p>}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-md bg-transparent border border-white/10 text-white hover:bg-white/5 transition-colors font-bold text-sm tracking-wider"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 rounded-md bg-[#a855f7] hover:bg-[#9333ea] text-white transition-colors font-bold text-sm tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  {editingShip ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}


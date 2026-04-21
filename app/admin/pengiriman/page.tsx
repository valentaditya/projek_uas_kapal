"use client";

import React, { useState, useEffect } from 'react';
import { 
  PlusCircleIcon,
  ListBulletIcon,
  CubeIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const defaultRequests = [
  { id: 'AO-2026-001', status: 'Dalam Perjalanan', type: 'Container', customer: 'PT Maju Jaya', route: 'Jakarta, Indonesia → Singapore', date: '10/4/2026', cargo: '15t / 33m³' },
  { id: 'AO-2026-002', status: 'Disetujui', type: 'Kargo Curah', customer: 'CV Sejahtera', route: 'Surabaya, Indonesia → Sydney, Australia', date: '12/4/2026', cargo: '5000t / 2500m³' },
  { id: 'AO-2026-003', status: 'Menunggu Persetujuan', type: 'Container', customer: 'Toko Elektronik Jaya', route: 'Hong Kong → Jakarta, Indonesia', date: '14/4/2026', cargo: '28t / 67m³' },
  { id: 'AO-2026-004', status: 'Dalam Perjalanan', type: 'Kendaraan/Ro-Ro', customer: 'Global Trading Co', route: 'Los Angeles, USA → Tokyo, Japan', date: '16/4/2026', cargo: '12t / 45m³' },
  { id: 'AO-2026-005', status: 'Disetujui', type: 'Cairan/Tanker', customer: 'PT Industri Kimia', route: 'Dubai, UAE → Jakarta, Indonesia', date: '18/4/2026', cargo: '2500t / 3000m³' },
];

export default function PengelolaanPengirimanPage() {
  const [activeTab, setActiveTab] = useState('kelola');
  const [filter, setFilter] = useState('ALL');
  const [requests, setRequests] = useState(defaultRequests);
  
  // Form State
  const [formData, setFormData] = useState({
     nama: '', email: '', telepon: '', 
     asal: '', tujuan: '', tanggal: '', jenis: '', 
     deskripsi: '', berat: '', volume: '', catatan: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('anagata_pengiriman');
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('anagata_pengiriman', JSON.stringify(requests));
  }, [requests]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `AO-2026-${String(requests.length + 1).padStart(3, '0')}`;
    const newRequest = {
      id: newId,
      status: 'Menunggu Persetujuan',
      type: formData.jenis,
      customer: formData.nama,
      route: `${formData.asal} → ${formData.tujuan}`,
      date: formData.tanggal.split('-').reverse().join('/'),
      cargo: `${formData.berat}t / ${formData.volume}m³`
    };
    
    setRequests([newRequest, ...requests]);
    setActiveTab('kelola');
    setFormData({
      nama: '', email: '', telepon: '', 
      asal: '', tujuan: '', tanggal: '', jenis: '', 
      deskripsi: '', berat: '', volume: '', catatan: ''
    });
  };

  const getStatusColor = (status: string) => {
    if (status === 'Dalam Perjalanan') return 'bg-cyan-500/10 text-cyan-400';
    if (status === 'Disetujui') return 'bg-blue-500/10 text-blue-400';
    if (status === 'Menunggu Persetujuan') return 'bg-yellow-500/10 text-yellow-400';
    if (status === 'Terkirim') return 'bg-emerald-500/10 text-emerald-400';
    return 'bg-gray-500/10 text-gray-400';
  };

  const pendingCount = requests.filter(r => r.status === 'Menunggu Persetujuan').length;
  const approvedCount = requests.filter(r => r.status === 'Disetujui').length;
  const inTransitCount = requests.filter(r => r.status === 'Dalam Perjalanan').length;
  const deliveredCount = requests.filter(r => r.status === 'Terkirim').length;

  const filteredRequests = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);

  return (
    <main className="mx-auto px-6 py-10 relative z-10 w-full max-w-[1500px]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Pengelolaan Pengiriman</h2>
        <p className="text-gray-400 text-xs tracking-wider">Buat permintaan pengiriman baru dan kelola semua permintaan</p>
      </div>

      <div className="flex border-b border-white/5 mb-8">
        <button 
          className={`flex items-center gap-2 px-6 py-3 font-bold text-xs tracking-wider border-b-2 transition-colors ${
            activeTab === 'buat' 
              ? 'border-[#b06aee] text-[#b06aee]' 
              : 'border-transparent text-gray-500 hover:text-gray-400'
          }`}
          onClick={() => setActiveTab('buat')}
        >
          <PlusCircleIcon className="w-4 h-4" />
          Buat Pengiriman Baru
        </button>
        <button 
          className={`flex items-center gap-2 px-6 py-3 font-bold text-xs tracking-wider border-b-2 transition-colors ${
            activeTab === 'kelola' 
              ? 'border-[#b06aee] text-[#b06aee]' 
              : 'border-transparent text-gray-500 hover:text-gray-400'
          }`}
          onClick={() => setActiveTab('kelola')}
        >
          <ListBulletIcon className="w-4 h-4" />
          Kelola Permintaan ({requests.length})
        </button>
      </div>

      {activeTab === 'buat' && (
        <div className="space-y-6 mb-20 animate-in fade-in duration-300">
          <div className="bg-[#151922] border border-white/5 rounded-[10px] p-6">
            <h3 className="text-white font-bold text-sm tracking-wider mb-2">Form Pengiriman Barang</h3>
            <p className="text-[#8c94a3] text-xs font-mono">Isi form di bawah untuk membuat request pengiriman baru</p>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-6">
            <div className="bg-[#151922] border border-white/5 rounded-[10px] p-6">
              <div className="flex items-center gap-2 mb-6">
                <CubeIcon className="w-5 h-5 text-[#b06aee]" />
                <h3 className="text-white font-bold tracking-widest text-sm uppercase">Informasi Pengirim</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-300 mb-3 font-mono">Nama Lengkap / Perusahaan *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all font-mono"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-300 mb-3 font-mono">Email *</label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all font-mono"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-300 mb-3 font-mono">Nomor Telepon *</label>
                  <input 
                    required 
                    type="tel" 
                    value={formData.telepon} onChange={e => setFormData({...formData, telepon: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#151922] border border-white/5 rounded-[10px] p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPinIcon className="w-5 h-5 text-[#b06aee]" />
                <h3 className="text-white font-bold tracking-widest text-sm uppercase">Detail Pengiriman</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-300 mb-3 font-mono">Pelabuhan Asal *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.asal} onChange={e => setFormData({...formData, asal: e.target.value})}
                    placeholder="Contoh: Jakarta, Indonesia"
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all font-mono placeholder:text-gray-600"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-300 mb-3 font-mono">Pelabuhan Tujuan *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.tujuan} onChange={e => setFormData({...formData, tujuan: e.target.value})}
                    placeholder="Contoh: Singapore"
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all font-mono placeholder:text-gray-600"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-300 mb-3 font-mono">Tanggal Pengiriman *</label>
                  <input 
                    required 
                    type="date" 
                    value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-3.5 text-sm text-gray-400 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all font-mono"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-300 mb-3 font-mono">Jenis Kargo *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.jenis} onChange={e => setFormData({...formData, jenis: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#151922] border border-white/5 rounded-[10px] p-6">
              <div className="flex items-center gap-2 mb-6">
                <CubeIcon className="w-5 h-5 text-[#b06aee]" />
                <h3 className="text-white font-bold tracking-widest text-sm uppercase">Informasi Kargo</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-300 mb-3 font-mono">Deskripsi Kargo *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.deskripsi} onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                    placeholder="Contoh: 20ft Container - Electronics"
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all font-mono placeholder:text-gray-600"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-300 mb-3 font-mono">Berat (Ton) *</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.berat} onChange={e => setFormData({...formData, berat: e.target.value})}
                    placeholder="0"
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all font-mono placeholder:text-gray-600"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-300 mb-3 font-mono">Volume (m³) *</label>
                  <input 
                    required 
                    type="number" 
                    value={formData.volume} onChange={e => setFormData({...formData, volume: e.target.value})}
                    placeholder="0"
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all font-mono placeholder:text-gray-600"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold text-gray-300 mb-3 font-mono">Catatan Tambahan</label>
                  <input 
                    type="text" 
                    value={formData.catatan} onChange={e => setFormData({...formData, catatan: e.target.value})}
                    placeholder="Informasi khusus tentang kargo..."
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-3.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all font-mono placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                type="submit"
                className="px-8 py-3 rounded-md bg-[#a855f7] hover:bg-[#9333ea] text-white font-bold text-xs tracking-wider transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}
      
      {activeTab === 'kelola' && (
        <div className="space-y-6 mb-20 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-[#151922] border border-white/5 rounded-lg p-5">
              <h4 className="text-gray-400 text-[10px] font-mono mb-2">Total Permintaan</h4>
              <span className="text-2xl font-bold text-white font-mono">{requests.length}</span>
            </div>
            <div className="bg-[#151922] border border-white/5 rounded-lg p-5">
              <h4 className="text-gray-400 text-[10px] font-mono mb-2">Menunggu Persetujuan</h4>
              <span className="text-2xl font-bold text-yellow-500 font-mono">{pendingCount}</span>
            </div>
            <div className="bg-[#151922] border border-white/5 rounded-lg p-5">
              <h4 className="text-gray-400 text-[10px] font-mono mb-2">Disetujui</h4>
              <span className="text-2xl font-bold text-blue-500 font-mono">{approvedCount}</span>
            </div>
            <div className="bg-[#151922] border border-white/5 rounded-lg p-5">
              <h4 className="text-gray-400 text-[10px] font-mono mb-2">Dalam Perjalanan</h4>
              <span className="text-2xl font-bold text-cyan-500 font-mono">{inTransitCount}</span>
            </div>
            <div className="bg-[#151922] border border-white/5 rounded-lg p-5">
              <h4 className="text-gray-400 text-[10px] font-mono mb-2">Terkirim</h4>
              <span className="text-2xl font-bold text-emerald-500 font-mono">{deliveredCount}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: 'ALL', count: requests.length, value: 'ALL' },
              { label: 'Menunggu Persetujuan', count: pendingCount, value: 'Menunggu Persetujuan' },
              { label: 'Disetujui', count: approvedCount, value: 'Disetujui' },
              { label: 'Dalam Perjalanan', count: inTransitCount, value: 'Dalam Perjalanan' },
              { label: 'Terkirim', count: deliveredCount, value: 'Terkirim' },
            ].map(f => (
              <button 
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-md text-[10px] tracking-wider font-bold transition-all ${
                  filter === f.value 
                    ? 'bg-[#b06aee] text-white shadow-[0_0_10px_rgba(176,106,238,0.4)]' 
                    : 'bg-[#151a23] border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredRequests.map((req, idx) => (
              <div key={idx} className="bg-[#151922] border border-white/5 rounded-lg p-6 hover:border-purple-500/30 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gray-200 font-bold tracking-wider text-sm font-mono">{req.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-[11px] font-mono">{req.type}</p>
                  </div>
                  <button className="text-[#b06aee] text-[10px] font-bold tracking-wider hover:text-purple-300 transition-colors">
                    View Details
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 text-gray-500">
                      <UserIcon className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-mono uppercase tracking-wider">Customer</span>
                    </div>
                    <p className="text-gray-200 text-xs font-mono font-medium pl-5">{req.customer}</p>
                  </div>
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-2 mb-1.5 text-gray-500">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-mono uppercase tracking-wider">Rute</span>
                    </div>
                    <p className="text-gray-200 text-xs font-mono font-medium pl-5">{req.route}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 text-gray-500">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-mono uppercase tracking-wider">Tanggal</span>
                    </div>
                    <p className="text-gray-200 text-xs font-mono font-medium pl-5">{req.date}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 text-gray-500">
                      <CubeIcon className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-mono uppercase tracking-wider">Cargo</span>
                    </div>
                    <p className="text-gray-200 text-xs font-mono font-medium pl-5">{req.cargo}</p>
                  </div>
                </div>
              </div>
            ))}

            {filteredRequests.length === 0 && (
              <div className="text-center py-20 border border-white/5 rounded-lg border-dashed">
                <p className="text-gray-500 text-sm font-mono">Tidak ada request ditemukan.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

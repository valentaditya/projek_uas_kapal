"use client";

import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';


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
  const defaultShips = [
    { name: 'ANAGATA PIONEER', type: 'Container', status: 'En Route', kapten: 'Kapten Budi Santoso', tujuan: 'Los Angeles', region: 'Pacific', fuel: '71.235866115601%', statusColor: 'text-[#3b82f6]', statusBg: 'bg-[#3b82f6]/10' },
    { name: 'ANAGATA OCEAN', type: 'Bulk Carrier', status: 'In Port', kapten: 'Kapten Agus Wijaya', tujuan: 'Singapore', region: 'Southeast Asia', fuel: '45%', statusColor: 'text-[#10b981]', statusBg: 'bg-[#10b981]/10' },
    { name: 'ANAGATA WAVE', type: 'Tanker', status: 'Delayed', kapten: 'Kapten Andi Pratama', tujuan: 'Sydney', region: 'Oceania', fuel: '62%', statusColor: 'text-[#eab308]', statusBg: 'bg-[#eab308]/10' },
    { name: 'ANAGATA VOYAGER', type: 'Container', status: 'En Route', kapten: 'Kapten Hendra Kusuma', tujuan: 'Rotterdam', region: 'Europe', fuel: '76.73535526938965%', statusColor: 'text-[#3b82f6]', statusBg: 'bg-[#3b82f6]/10' },
    { name: 'ANAGATA HORIZON', type: 'Ro-Ro', status: 'Maintenance', kapten: 'Kapten Dedi Setiawan', tujuan: 'New York', region: 'North America', fuel: '35%', statusColor: 'text-[#f97316]', statusBg: 'bg-[#f97316]/10' },
    { name: 'ANAGATA NAVIGATOR', type: 'Container', status: 'En Route', kapten: 'Kapten Rudi Hartono', tujuan: 'Hong Kong', region: 'East Asia', fuel: '64.24044533047322%', statusColor: 'text-[#3b82f6]', statusBg: 'bg-[#3b82f6]/10' },
    { name: 'ANAGATA GUARDIAN', type: 'Bulk Carrier', status: 'En Route', kapten: 'Kapten Bambang Suryadi', tujuan: 'Santos', region: 'South America', fuel: '60.58154445936869%', statusColor: 'text-[#3b82f6]', statusBg: 'bg-[#3b82f6]/10' },
    { name: 'ANAGATA SENTINEL', type: 'Tanker', status: 'In Port', kapten: 'Kapten Arief Budiman', tujuan: 'Dubai', region: 'Middle East', fuel: '52%', statusColor: 'text-[#10b981]', statusBg: 'bg-[#10b981]/10' },
  ];
  const [shipsData, setShipsData] = useState<any[]>([]);
  const [ships, setShips] = useState(defaultShips);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', type: '', kapten: '', tujuan: '', region: '', status: '', fuel: '100'
  });

  React.useEffect(() => {
    const fetchKapal = async () => {
      // 1. Minta data ke supabase
      const { data, error } = await supabase.from('kapal').select('*');

      if (data && !error) {
        // 2. Format datanya (kasih warna)
        const formattedData = data.map(ship => {
          let statusColor = 'text-[#3b82f6]'; // default biru
          let statusBg = 'bg-[#3b82f6]/10';   // default biru
          // ... (pengecekan status kapal)
          
          return { ...ship, statusColor, statusBg };
        });
        
        // 3. Masukkan data yang sudah rapi ke wadah React
        setShipsData(formattedData);
      }
    };

    fetchKapal(); // Jalankan pertama kali saat halaman dibuka
  }, [supabase]);

  React.useEffect(() => {
    const saved = localStorage.getItem('anagata_ships');
    if (saved) {
      try {
        setShips(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('anagata_ships', JSON.stringify(ships));
  }, [ships]);

  const filteredShips = ships.filter(ship => 
    ship.name.toLowerCase().includes(search.toLowerCase()) || 
    ship.kapten.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let statusBg = 'bg-gray-500/10';
    let statusColor = 'text-gray-500';
    const s = formData.status.toLowerCase();
    if (s.includes('route')) { statusColor = 'text-[#3b82f6]'; statusBg = 'bg-[#3b82f6]/10'; }
    else if (s.includes('port')) { statusColor = 'text-[#10b981]'; statusBg = 'bg-[#10b981]/10'; }
    else if (s.includes('delay')) { statusColor = 'text-[#eab308]'; statusBg = 'bg-[#eab308]/10'; }
    else if (s.includes('maintenance')) { statusColor = 'text-[#f97316]'; statusBg = 'bg-[#f97316]/10'; }
    else { statusColor = 'text-[#b06aee]'; statusBg = 'bg-[#b06aee]/10'; }

    const newShip = {
      ...formData,
      fuel: formData.fuel + '%',
      statusColor,
      statusBg
    };

    setShips([newShip, ...ships]);
    setIsModalOpen(false);
    setFormData({ name: '', type: '', kapten: '', tujuan: '', region: '', status: '', fuel: '100' });
  };

  const deleteShip = (idx: number) => {
    const newShips = [...ships];
    const realIdx = ships.findIndex(s => s === filteredShips[idx]);
    if (realIdx !== -1) {
      newShips.splice(realIdx, 1);
      setShips(newShips);
    }
  };
  const totalKapal = shipsData.length;
  const countEnRoute = shipsData.filter(s => s.status_kapal === 'En Route').length;


  return (
    <main className="mx-auto px-6 py-10 relative z-10 w-full max-w-[1500px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Kelola Data Kapal</h2>
          <p className="text-gray-400 text-xs tracking-wider">Manajemen lengkap armada kapal</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
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
        {filteredShips.map((ship, idx) => (
          <div key={idx} className="bg-[#151922] border border-white/5 rounded-[10px] p-6 flex flex-col h-full">
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
                {ship.status}
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 text-gray-400 hover:text-[#b06aee] transition-colors rounded hover:bg-white/5">
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button onClick={() => deleteShip(idx)} className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors rounded hover:bg-white/5">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151922] border border-white/5 rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-xl font-bold tracking-wider text-white">Tambah Kapal Baru</h3>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nama Kapal *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Tipe Kapal *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nama Kapten *</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Kapten..."
                    value={formData.kapten} onChange={e => setFormData({...formData, kapten: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder:text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Tujuan *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.tujuan} onChange={e => setFormData({...formData, tujuan: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Region *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Status *</label>
                  <div className="relative">
                    <select 
                      required 
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Pilih Status</option>
                      <option value="En Route">En Route</option>
                      <option value="In Port">In Port</option>
                      <option value="Delayed">Delayed</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Fuel (%) *</label>
                  <input 
                    required 
                    type="number" 
                    min="0" max="100"
                    value={formData.fuel} onChange={e => setFormData({...formData, fuel: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50"
                  />
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
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { 
  CalculatorIcon, 
  MapPinIcon, 
  ScaleIcon, 
  CubeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import Swal from 'sweetalert2';

const CARGO_TYPES = [
  { value: 'Elektronik', label: 'Elektronik', rateKg: 15000, rateM3: 70000 },
  { value: 'Furniture', label: 'Furniture', rateKg: 8000, rateM3: 40000 },
  { value: 'Bahan Kimia', label: 'Bahan Kimia (Chemicals)', rateKg: 20000, rateM3: 100000 },
  { value: 'Kendaraan', label: 'Kendaraan (Vehicles)', rateKg: 12000, rateM3: 60000 },
  { value: 'Kargo Umum', label: 'Kargo Umum (General Cargo)', rateKg: 6000, rateM3: 30000 }
];

export default function CekBiayaPage() {
  const [ports, setPorts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    asal: '',
    tujuan: '',
    berat: '',
    volume: '',
    jenis: 'Kargo Umum'
  });
  const [useInsurance, setUseInsurance] = useState(false);
  const [calculation, setCalculation] = useState<any>(null);

  useEffect(() => {
    const fetchPorts = async () => {
      // cara connect db
      const supabase = createClient();
      try {
        const { data, error } = await // cara ambil data di db
 supabase.from('pelabuhan').select('id, nama_pelabuhan, kota')
          .order('nama_pelabuhan', { ascending: true });
        if (data && !error) {
          setPorts(data);
        }
      } catch (err) {
        console.error("Failed to fetch ports:", err);
      }
    };
    fetchPorts();
  }, []);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.asal || !formData.tujuan) {
      Swal.fire({
        icon: 'warning',
        title: 'Form Belum Lengkap',
        text: 'Pilih pelabuhan asal dan tujuan terlebih dahulu!'
      });
      return;
    }

    if (formData.asal === formData.tujuan) {
      Swal.fire({
        icon: 'error',
        title: 'Rute Tidak Valid',
        text: 'Pelabuhan asal dan tujuan tidak boleh sama!'
      });
      return;
    }

    const beratVal = parseFloat(formData.berat);
    if (isNaN(beratVal) || beratVal <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Input Tidak Valid',
        text: 'Berat barang harus berupa angka lebih besar dari 0!'
      });
      return;
    }

    const volumeVal = parseFloat(formData.volume) || 0;
    if (volumeVal < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Input Tidak Valid',
        text: 'Volume barang tidak boleh negatif!'
      });
      return;
    }

    const selectedType = CARGO_TYPES.find(c => c.value === formData.jenis) || CARGO_TYPES[4];
    

    const costWeight = beratVal * selectedType.rateKg;
    const costVolume = volumeVal * selectedType.rateM3;
    const totalCargoCost = costWeight + costVolume;
    const totalInsuranceCost = useInsurance ? Math.max(10000, Math.round(totalCargoCost * 0.005)) : 0;
    const subtotal = totalCargoCost + totalInsuranceCost;

    const portAsal = ports.find(p => String(p.id) === formData.asal);
    const portTujuan = ports.find(p => String(p.id) === formData.tujuan);

    setCalculation({
      asalName: portAsal ? `${portAsal.nama_pelabuhan}, ${portAsal.kota}` : '',
      tujuanName: portTujuan ? `${portTujuan.nama_pelabuhan}, ${portTujuan.kota}` : '',
      berat: beratVal,
      volume: volumeVal,
      jenis: selectedType.label,
      costWeight,
      costVolume,
      totalCargoCost,
      totalInsuranceCost,
      subtotal
    });
  };

  return (
    <div className="w-full flex justify-center py-20 pb-32">
      <div className="max-w-6xl w-full px-6">
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="w-12 h-12 border border-[#d946ef]/30 rounded flex items-center justify-center mb-6">
            <CalculatorIcon className="w-6 h-6 text-[#d946ef]" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-wide text-white">Kalkulator Biaya Pengiriman</h3>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            Hitung estimasi biaya pengiriman secara real-time berdasarkan rute, berat, volume, dan jenis kargo.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          
          <form onSubmit={handleCalculate} className="bg-[#13161f] border border-white/5 rounded-lg p-8 space-y-5">
            <h4 className="font-bold text-[15px] text-white mb-6">Informasi Pengiriman</h4>
            
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2 font-mono">
                <MapPinIcon className="w-4 h-4 text-gray-500" />
                Pelabuhan Asal *
              </label>
              <div className="relative">
                <select 
                  required 
                  value={formData.asal}
                  onChange={e => setFormData({...formData, asal: e.target.value})}
                  className="w-full bg-[#0d1017] border border-white/5 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d946ef]/50 appearance-none cursor-pointer"
                >
                  <option value="">-- Pilih Pelabuhan Asal --</option>
                  {ports.map(p => (
                    <option key={p.id} value={p.id}>{p.nama_pelabuhan}, {p.kota}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2 font-mono">
                <MapPinIcon className="w-4 h-4 text-gray-500" />
                Pelabuhan Tujuan *
              </label>
              <div className="relative">
                <select 
                  required 
                  value={formData.tujuan}
                  onChange={e => setFormData({...formData, tujuan: e.target.value})}
                  className="w-full bg-[#0d1017] border border-white/5 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d946ef]/50 appearance-none cursor-pointer"
                >
                  <option value="">-- Pilih Pelabuhan Tujuan --</option>
                  {ports.map(p => (
                    <option key={p.id} value={p.id}>{p.nama_pelabuhan}, {p.kota}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2 font-mono">
                  <ScaleIcon className="w-4 h-4 text-gray-500" />
                  Berat Paket (kg) *
                </label>
                <input 
                  type="number" 
                  required
                  value={formData.berat}
                  onChange={e => setFormData({...formData, berat: e.target.value})}
                  placeholder="Contoh: 10"
                  className="w-full bg-[#0d1017] border border-white/5 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d946ef]/50 transition-colors placeholder:text-gray-600 font-mono"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2 font-mono">
                  <CubeIcon className="w-4 h-4 text-gray-500" />
                  Volume Paket (m³)
                </label>
                <input 
                  type="number" 
                  value={formData.volume}
                  onChange={e => setFormData({...formData, volume: e.target.value})}
                  placeholder="Contoh: 2"
                  className="w-full bg-[#0d1017] border border-white/5 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d946ef]/50 transition-colors placeholder:text-gray-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2 font-mono">
                <CubeIcon className="w-4 h-4 text-gray-500" />
                Jenis Barang *
              </label>
              <div className="relative">
                <select 
                  value={formData.jenis}
                  onChange={e => setFormData({...formData, jenis: e.target.value})}
                  className="w-full bg-[#0d1017] border border-white/5 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d946ef]/50 appearance-none cursor-pointer"
                >
                  {CARGO_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0d1017] border border-white/5 rounded flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={useInsurance}
                  onChange={e => setUseInsurance(e.target.checked)}
                  className="rounded bg-[#13161f] border-white/5 text-[#a35de9] focus:ring-offset-[#0d1017] focus:ring-[#a35de9]"
                />
                <span className="text-xs font-semibold text-gray-300 font-mono flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-[#a35de9]" /> Gunakan Asuransi Pengiriman (+0.5%)
                </span>
              </label>
            </div>
            
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-[#a35de9] hover:bg-[#8643c7] transition-all rounded text-sm font-semibold text-white shadow-[0_0_15px_rgba(163,93,233,0.3)]"
            >
              <CalculatorIcon className="w-4 h-4" />
              Hitung Biaya Pengiriman
            </button>
          </form>
          
          
          <div className="bg-[#13161f] border border-white/5 rounded-lg p-8 flex flex-col justify-between min-h-[400px]">
            {!calculation ? (
              <div className="flex flex-col items-center justify-center text-center h-full my-auto">
                <CalculatorIcon className="w-12 h-12 text-gray-600 mb-6" />
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Masukkan informasi pengiriman pada panel kiri untuk melihat estimasi rincian biaya.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300 flex flex-col justify-between h-full">
                <div>
                  <h4 className="font-bold text-[15px] text-white mb-6 pb-2 border-b border-white/5">Estimasi Rincian Biaya</h4>
                  
                  <div className="space-y-4 text-xs font-mono">
                    <div className="flex justify-between pb-1 border-b border-white/[0.03]">
                      <span className="text-gray-400">Rute:</span>
                      <span className="text-white text-right max-w-[220px]">{calculation.asalName} &rarr; {calculation.tujuanName}</span>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-white/[0.03]">
                      <span className="text-gray-400">Jenis Barang:</span>
                      <span className="text-white">{calculation.jenis}</span>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-white/[0.03]">
                      <span className="text-gray-400">Berat Barang:</span>
                      <span className="text-white">{calculation.berat} kg</span>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-white/[0.03]">
                      <span className="text-gray-400">Volume Barang:</span>
                      <span className="text-white">{calculation.volume} m³</span>
                    </div>
                    
                    <div className="pt-2 space-y-2">
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>Biaya Berat:</span>
                        <span>Rp {calculation.costWeight.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>Biaya Volume:</span>
                        <span>Rp {calculation.costVolume.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-400 font-semibold">
                        <span>Total Biaya Kargo:</span>
                        <span>Rp {calculation.totalCargoCost.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-400 font-semibold">
                        <span>Premi Asuransi:</span>
                        <span>Rp {calculation.totalInsuranceCost.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-dashed border-white/10 mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">Estimasi Total Tagihan:</span>
                    <span className="text-lg font-black text-[#d946ef] font-mono">Rp {calculation.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed bg-[#0d1017] p-3 rounded border border-white/5">
                    * Catatan: Biaya di atas hanyalah estimasi awal. Harga resmi dapat bervariasi bergantung pada ketersediaan jadwal, diskon khusus, dan penilaian kargo aktual saat pembuatan pengiriman resmi.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

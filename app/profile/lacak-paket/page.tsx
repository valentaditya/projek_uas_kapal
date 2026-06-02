"use client";

import React, { useState } from 'react';
import { 
  CubeIcon, 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  CalendarIcon, 
  UserIcon, 
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon
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

export default function LacakPaketPage() {
  const [resiInput, setResiInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [shipment, setShipment] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resiInput.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Input Kosong',
        text: 'Masukkan nomor resi terlebih dahulu!'
      });
      return;
    }

    setLoading(true);
    setShipment(null);
    setHasSearched(true);
    // cara connect db
    const supabase = createClient();

    try {
      const { data, error } = await // cara ambil data di db
 supabase.from('pengiriman').select('*, detail_barang(*, asuransi_barang(*))')
        .eq('nomor_resi', resiInput.trim())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setShipment(data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Resi Tidak Ditemukan',
          text: `Nomor resi ${resiInput} tidak terdaftar di sistem kami.`
        });
      }
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: err.message || 'Gagal melacak nomor resi.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusStepIndex = (status: string) => {
    if (status === 'Disetujui') return 1;
    if (status === 'Dalam Perjalanan' || status === 'Kirim') return 2;
    if (status === 'Terkirim') return 3;
    return 0;
  };

  const steps = [
    { title: 'Menunggu Persetujuan', desc: 'Permintaan dibuat & menunggu verifikasi admin' },
    { title: 'Disetujui', desc: 'Pengiriman disetujui & masuk antrean jadwal kapal' },
    { title: 'Dalam Perjalanan', desc: 'Barang dalam perjalanan laut menuju pelabuhan tujuan' },
    { title: 'Terkirim', desc: 'Barang telah diterima di tujuan pengiriman' }
  ];

  const currentStepIdx = shipment ? getStatusStepIndex(shipment.status) : 0;

  return (
    <div className="w-full flex justify-center py-20 pb-32">
      <div className="max-w-4xl w-full px-6">
        <div className="text-center mb-16 flex flex-col items-center">
          <CubeIcon className="w-12 h-12 text-[#d946ef] mb-6 animate-bounce" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-wide text-white">Lacak Paket Anda</h3>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
            Pantau posisi dan status pengiriman barang secara real-time langsung dari database kami.
          </p>
        </div>
        
        <form onSubmit={handleTrack} className="bg-[#13161f] border border-white/5 rounded-lg p-8 mb-6">
          <h4 className="font-bold text-sm text-white mb-4">Masukkan Nomor Tracking / Resi</h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={resiInput}
              onChange={(e) => setResiInput(e.target.value)}
              placeholder="Contoh: AO-2026-110" 
              className="flex-grow bg-[#0d1017] border border-white/5 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d946ef]/50 transition-colors placeholder:text-gray-600 font-mono"
            />
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-[#a35de9] hover:bg-[#8643c7] disabled:opacity-50 transition-all rounded text-sm font-semibold text-white shadow-[0_0_15px_rgba(163,93,233,0.3)]"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              {loading ? 'Mencari...' : 'Lacak'}
            </button>
          </div>
        </form>
        
        {!shipment ? (
          <div className="bg-[#13161f] border border-white/5 rounded-lg p-16 flex flex-col items-center justify-center text-center">
            <CubeIcon className="w-10 h-10 text-gray-500 mb-6" />
            <h4 className="font-bold text-[15px] text-white mb-3">
              {hasSearched ? 'Hasil Pencarian Kosong' : 'Belum Ada Hasil Tracking'}
            </h4>
            <p className="text-xs text-gray-400 mb-2">
              Masukkan nomor resi yang valid pada kolom di atas untuk melihat status pengiriman.
            </p>
            <p className="text-[11px] text-gray-600">
              Nomor resi Anda berformat seperti: <code className="font-mono text-purple-400/80">AO-[Tahun]-[Kode]</code>
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="bg-[#13161f] border border-white/5 rounded-lg p-8">
              <h4 className="font-bold text-sm text-white mb-8">Status Pengiriman ({shipment.nomor_resi})</h4>
              
              <div className="relative border-l border-white/10 pl-6 space-y-8 ml-3">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isActive = idx === currentStepIdx;
                  return (
                    <div key={idx} className="relative">
                      <span className={`absolute -left-[35px] top-0 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-[#13161f] ${
                        isCompleted ? 'bg-[#a35de9] text-white' : 'bg-gray-800 text-gray-500'
                      }`}>
                        {isCompleted ? (
                          <CheckCircleIcon className="w-4 h-4" />
                        ) : (
                          <ClockIcon className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${isCompleted ? 'text-white' : 'text-gray-500'}`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] text-gray-500 mt-1">
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            
            <div className="bg-[#13161f] border border-white/5 rounded-lg p-8 grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-sm text-white mb-4 pb-2 border-b border-white/5">Informasi Rute & Pengiriman</h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pengirim:</span>
                    <span className="text-white font-semibold">{shipment.nama_pengirim || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Penerima:</span>
                    <span className="text-white font-semibold">{shipment.nama_penerima || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Alamat Penerima:</span>
                    <span className="text-white font-semibold text-right max-w-[200px]">{shipment.alamat_penerima || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pelabuhan Asal:</span>
                    <span className="text-white font-semibold">{shipment.pelabuhan_asal || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pelabuhan Tujuan:</span>
                    <span className="text-white font-semibold">{shipment.pelabuhan_tujuan || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tanggal Pengiriman:</span>
                    <span className="text-white font-semibold font-mono">{shipment.tanggal_pengiriman ? shipment.tanggal_pengiriman.split('-').reverse().join('/') : '-'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white mb-4 pb-2 border-b border-white/5">Detail Barang</h4>
                <div className="space-y-4 max-h-[160px] overflow-y-auto pr-2">
                  {(shipment.detail_barang || []).map((barang: any, bIdx: number) => (
                    <div key={barang.id} className="p-3 bg-[#0d1017] border border-white/5 rounded">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-white font-mono">{bIdx + 1}. {barang.jenis_barang}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{barang.berat_kg} kg | {barang.volume_m3 || 0} m³</span>
                      </div>
                      <p className="text-[10px] text-gray-400">{barang.deskripsi_barang}</p>
                      {barang.catatan_tambahan && (
                        <p className="text-[9px] text-[#a35de9] mt-1 font-mono">Note: {barang.catatan_tambahan}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

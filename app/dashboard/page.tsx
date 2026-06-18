"use client";

import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  CubeIcon,
  ClockIcon,
  CheckBadgeIcon,
  MapPinIcon,
  CalendarIcon,
  PaperAirplaneIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [stats, setStats] = useState({
    total: 0,
    transit: 0,
    tunggu: 0,
    selesai: 0
  });

  const getStatusColor = (status: string) => {
    if (status === 'Dalam Perjalanan' || status === 'Kirim') return 'text-[#06b6d4]';
    if (status === 'Disetujui') return 'text-[#3b82f6]';
    if (status === 'Terkirim') return 'text-[#10b981]';
    return 'text-[#eab308]';
  };

  const getStatusBg = (status: string) => {
    if (status === 'Dalam Perjalanan' || status === 'Kirim') return 'bg-[#06b6d4]/10';
    if (status === 'Disetujui') return 'bg-[#3b82f6]/10';
    if (status === 'Terkirim') return 'bg-[#10b981]/10';
    return 'bg-[#eab308]/10';
  };

  const getBorderColor = (status: string) => {
    if (status === 'Dalam Perjalanan' || status === 'Kirim') return 'border-[#06b6d4]/30';
    if (status === 'Disetujui') return 'border-[#3b82f6]/30';
    if (status === 'Terkirim') return 'border-[#10b981]/30';
    return 'border-[#eab308]/30';
  };

  const getProgressText = (status: string) => {
    if (status === 'Dalam Perjalanan' || status === 'Kirim') return 'Dalam perjalanan ke pelabuhan tujuan';
    if (status === 'Disetujui') return 'Pengiriman disetujui, menunggu jadwal kapal';
    if (status === 'Terkirim') return 'Barang telah diterima di tujuan';
    return 'Menunggu verifikasi admin';
  };

  const fetchUserShipments = async (userId: number) => {
    // cara connect db
    const supabase = createClient();
    try {
      const { data, error } = await // cara ambil data di db
 supabase.from('detail_pengiriman').select(`
          subtotal,
          pengiriman:id_pengiriman (
            id,
            nomor_resi,
            nama_pengirim,
            email_pengirim,
            nomor_telepon_pengirim,
            alamat_pengirim,
            nama_penerima,
            email_penerima,
            nomor_telepon_penerima,
            alamat_penerima,
            pelabuhan_asal,
            pelabuhan_tujuan,
            tanggal_pengiriman,
            status,
            detail_barang (
              id,
              jenis_barang,
              deskripsi_barang,
              berat_kg,
              volume_m3,
              catatan_tambahan
            )
          )
        `)
        .eq('id_user', userId);

      if (data && !error) {

        const list = data
          .map((dp: any) => {
            const p = dp.pengiriman;
            if (!p) return null;

            const items = p.detail_barang || [];
            const totalWeightVal = items.reduce((sum: number, item: any) => sum + (parseFloat(item.berat_kg) || 0), 0);
            const totalVolumeVal = items.reduce((sum: number, item: any) => sum + (parseFloat(item.volume_m3) || 0), 0);
            const itemTypes = Array.from(new Set(items.map((item: any) => item.jenis_barang))).join(', ') || 'Kargo Umum';

            return {
              id: p.nomor_resi || `AO-${p.id}`,
              status: p.status || 'Menunggu Persetujuan',
              statusColor: getStatusColor(p.status),
              statusBg: getStatusBg(p.status),
              borderColor: getBorderColor(p.status),
              progress: getProgressText(p.status),
              type: itemTypes,
              pengirim: p.nama_pengirim || '-',
              penerima: p.nama_penerima || '-',
              asal: p.pelabuhan_asal || '-',
              tujuan: p.pelabuhan_tujuan || '-',
              tanggal: p.tanggal_pengiriman ? p.tanggal_pengiriman.split('-').reverse().join('/') : '-',
              biaya: `Rp ${dp.subtotal ? dp.subtotal.toLocaleString('id-ID') : '0'}`,
              details: items.map((i: any) => `${i.jenis_barang} (${i.deskripsi_barang || ''})`).join(', ') || 'Kargo Umum',
              weight: `${totalWeightVal} kg`,
              volume: `${totalVolumeVal || 0} m³`,
              catatan: items.map((i: any) => i.catatan_tambahan).filter(Boolean).join(', ') || '-',
              itemsList: items
            };
          })
          .filter(Boolean);

        setShipments(list);


        const total = list.length;
        const transit = list.filter((s: any) => s.status === 'Dalam Perjalanan' || s.status === 'Kirim').length;
        const tunggu = list.filter((s: any) => s.status === 'Menunggu Persetujuan').length;
        const selesai = list.filter((s: any) => s.status === 'Terkirim').length;

        setStats({ total, transit, tunggu, selesai });
      }
    } catch (err) {
      console.error("Error fetching user shipments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';').shift()!);
      return null;
    };

    const session = getCookie('session_user');
    if (session) {
      try {
        const parsedUser = JSON.parse(session);
        setCurrentUser(parsedUser);
        if (parsedUser?.id) {
          fetchUserShipments(parsedUser.id);
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Error parsing session user:", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const filteredShipments = shipments.filter((item: any) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.id.toLowerCase().includes(q) ||
      item.pengirim.toLowerCase().includes(q) ||
      item.tujuan.toLowerCase().includes(q) ||
      item.asal.toLowerCase().includes(q)
    );
  });

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 relative z-10 w-full space-y-6 flex-1">
      <div className="bg-[#1a1625] border border-purple-500/20 rounded-lg p-6">
        <h2 className="text-xl font-bold tracking-wider text-white mb-1">
          Selamat Datang, {currentUser ? currentUser.nama_lengkap || currentUser.username : "Customer User"}
        </h2>
        <p className="text-gray-400 text-xs tracking-wider">Lacak status pengiriman barang Anda secara real-time</p>
      </div>

      <div className="bg-[#151922] border border-white/5 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3 text-gray-300 text-sm font-semibold">
          <MagnifyingGlassIcon className="w-4 h-4 text-[#b06aee]" />
          Tracking Pengiriman
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0e1017] border border-white/10 rounded px-10 py-2.5 text-sm outline-none focus:border-purple-500 transition-colors placeholder-gray-600 focus:ring-1 focus:ring-purple-500 text-white font-mono"
            placeholder="Masukkan nomor tracking (contoh: AO-2026-001) atau nama..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#151922] border border-white/5 rounded-lg p-5 flex flex-col gap-1 justify-center relative overflow-hidden">
          <div className="flex flex-col gap-1 z-10">
            <div className="text-[11px] text-gray-500 tracking-widest font-semibold uppercase flex items-center gap-2">
              <CubeIcon className="w-4 h-4 text-gray-400" /> Total
            </div>
            {loading ? <div className="h-6 w-10 bg-white/5 animate-pulse rounded" /> : <p className="text-2xl font-black text-white">{stats.total}</p>}
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-lg p-5 flex flex-col gap-1 justify-center relative overflow-hidden">
          <div className="flex flex-col gap-1 z-10">
            <div className="text-[11px] text-gray-500 tracking-widest font-semibold uppercase flex items-center gap-2">
              <PaperAirplaneIcon className="w-4 h-4 text-[#3b82f6]" /> Transit
            </div>
            {loading ? <div className="h-6 w-10 bg-white/5 animate-pulse rounded" /> : <p className="text-2xl font-black text-white">{stats.transit}</p>}
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-lg p-5 flex flex-col gap-1 justify-center relative overflow-hidden">
          <div className="flex flex-col gap-1 z-10">
            <div className="text-[11px] text-gray-500 tracking-widest font-semibold uppercase flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-[#eab308]" /> Tunggu
            </div>
            {loading ? <div className="h-6 w-10 bg-white/5 animate-pulse rounded" /> : <p className="text-2xl font-black text-white">{stats.tunggu}</p>}
          </div>
        </div>

        <div className="bg-[#151922] border border-white/5 rounded-lg p-5 flex flex-col gap-1 justify-center relative overflow-hidden">
          <div className="flex flex-col gap-1 z-10">
            <div className="text-[11px] text-gray-500 tracking-widest font-semibold uppercase flex items-center gap-2">
              <CheckBadgeIcon className="w-4 h-4 text-[#10b981]" /> Selesai
            </div>
            {loading ? <div className="h-6 w-10 bg-white/5 animate-pulse rounded" /> : <p className="text-2xl font-black text-white">{stats.selesai}</p>}
          </div>
        </div>
      </div>

      <h3 className="text-white font-bold tracking-wider mt-8">Semua Pengiriman</h3>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="bg-[#151922] border border-white/5 rounded-lg p-6 relative animate-pulse">
              <div className="h-6 bg-white/5 rounded w-1/4 mb-4" />
              <div className="h-10 bg-white/5 rounded w-full mb-4" />
              <div className="h-20 bg-white/5 rounded w-full" />
            </div>
          ))
        ) : filteredShipments.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-lg border-dashed">
            <p className="text-gray-500 text-sm font-mono">Tidak ada pengiriman ditemukan.</p>
          </div>
        ) : (
          filteredShipments.map((item, idx) => (
            <div key={idx} className={`bg-[#151922] border ${item.borderColor} border-opacity-50 rounded-lg p-6 relative`}>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-200 font-mono">{item.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${item.statusBg} ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-semibold mb-1">Total Biaya</p>
                  <p className="text-[#b06aee] font-mono opacity-90">{item.biaya}</p>
                </div>
              </div>

              <div className="bg-[#0e1017]/50 rounded p-4 border border-white/5 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <p className="text-[10px] text-gray-500 mb-1">Pengirim</p>
                    <p className="text-xs text-gray-300 font-semibold">{item.pengirim}</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-gray-500 mb-1">Penerima</p>
                    <p className="text-xs text-gray-300 font-semibold">{item.penerima}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 border-b border-white/5 pb-5">
                 <div>
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Asal</span>
                    </div>
                    <p className="text-xs text-gray-300 ml-5 font-semibold">{item.asal}</p>
                 </div>
                 <div>
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      <MapPinIcon className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-[10px]">Tujuan</span>
                    </div>
                    <p className="text-xs text-gray-300 ml-5 font-semibold">{item.tujuan}</p>
                 </div>
                 <div>
                    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Tanggal</span>
                    </div>
                    <p className="text-xs text-gray-300 ml-5 font-semibold">{item.tanggal}</p>
                 </div>
              </div>

              <div className="mb-4">
                 <p className="text-xs font-semibold text-gray-300">{item.details}</p>
                 <p className="text-[11px] text-gray-500">Berat: {item.weight} &nbsp;|&nbsp; Volume: {item.volume}</p>
              </div>
              
              <div className="space-y-3">
                 <div className={`flex items-center gap-2 text-xs font-semibold ${item.statusColor}`}>
                    <InformationCircleIcon className="w-4 h-4" />
                    <span>{item.progress}</span>
                 </div>
                 {item.catatan && item.catatan !== '-' && (
                   <div className="text-[10px] text-gray-500">
                     <span className="text-gray-400">Catatan:</span> {item.catatan}
                   </div>
                 )}
              </div>

            </div>
          ))
        )}
      </div>

    </main>
  );
}

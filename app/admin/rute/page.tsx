"use client";

import React from 'react';
import { 
  MapPinIcon,
  PaperAirplaneIcon,
  EyeIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import Swal from 'sweetalert2';

const RoutePathIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="2.5" />
    <circle cx="6" cy="19" r="2.5" />
    <path d="M15.5 5H8a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h8a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H8.5" />
  </svg>
);

export default function ManajemenRutePage() {
  const [loading, setLoading] = React.useState(true);
  const [routes, setRoutes] = React.useState<any[]>([]);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      // cara connect db
      const supabase = createClient();
      const { data, error } = await // cara ambil data di db
 supabase.from('pengiriman').select('*, detail_barang(*)');

      if (error) throw error;

      if (data) {

        const shippedItems = data.filter((s: any) => s.status === 'Kirim' || s.status === 'Dalam Perjalanan');
        

        const chunks: any[][] = [];
        for (let i = 0; i < shippedItems.length; i += 5) {
          const chunk = shippedItems.slice(i, i + 5);
          if (chunk.length === 5) {
            chunks.push(chunk);
          }
        }


        const vesselNames = [
          'ANAGATA PIONEER',
          'ANAGATA OCEAN',
          'ANAGATA WAVE',
          'ANAGATA VOYAGER',
          'ANAGATA HORIZON',
          'ANAGATA NAVIGATOR',
          'ANAGATA GUARDIAN',
          'ANAGATA SENTINEL'
        ];


        const mappedRoutes = chunks.map((chunk, idx) => {
          const routeId = `R-${String(idx + 1).padStart(3, '0')}`;
          const ship = vesselNames[idx % vesselNames.length];

          const firstShipment = chunk[0];
          const origin = firstShipment.pelabuhan_asal || 'Unknown Port';
          const destination = firstShipment.pelabuhan_tujuan || 'Unknown Port';
          
          return {
            ship,
            routeId,
            origin,
            destination,
            distance: '1,200 nm',
            duration: '72 hrs',
            waypoints: 3,
            status: 'ACTIVE',
            shipments: chunk
          };
        });

        setRoutes(mappedRoutes);
      }
    } catch (err) {
      console.error('Error fetching routes:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRoutes();
  }, []);

  const handleViewRoute = (route: any) => {
    const popupHtml = `
      <div style="text-align: left; font-family: system-ui, -apple-system, sans-serif; font-size: 13px; color: #d1d5db; max-height: 400px; overflow-y: auto; padding-right: 5px;">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; margin-bottom: 12px;">
          <h4 style="font-weight: bold; color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">Detail Kapal & Rute</h4>
          <p style="margin: 3px 0;"><strong>Kapal:</strong> <span style="color: #c084fc;">${route.ship}</span></p>
          <p style="margin: 3px 0;"><strong>Route ID:</strong> <span style="font-family: monospace;">${route.routeId}</span></p>
          <p style="margin: 3px 0;"><strong>Rute Utama:</strong> ${route.origin} &rarr; ${route.destination}</p>
          <p style="margin: 3px 0;"><strong>Jarak / Durasi:</strong> ${route.distance} / ${route.duration}</p>
          <p style="margin: 3px 0;"><strong>Status Rute:</strong> <span style="color: #10b981;">${route.status}</span></p>
        </div>
        <div>
          <h4 style="font-weight: bold; color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">Daftar Pengiriman (5 Paket)</h4>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${route.shipments.map((shipment: any, idx: number) => {
              const items = shipment.detail_barang || [];
              const cargoSummary = items.map((it: any) => `${it.jenis_barang} (${it.berat_kg}kg)`).join(', ') || 'Kargo';
              return `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 6px;">
                  <div style="display: flex; justify-content: space-between; font-weight: bold; color: #ffffff; margin-bottom: 4px; font-size: 12px;">
                    <span style="font-family: monospace; color: #a855f7;">#${idx + 1} Resi: ${shipment.nomor_resi}</span>
                    <span style="font-size: 10px; color: #9ca3af;">${shipment.tanggal_pengiriman ? shipment.tanggal_pengiriman.split('-').reverse().join('/') : '-'}</span>
                  </div>
                  <p style="margin: 2px 0;"><strong>Customer:</strong> ${shipment.nama_pengirim || '-'}</p>
                  <p style="margin: 2px 0;"><strong>Penerima:</strong> ${shipment.nama_penerima || '-'}</p>
                  <p style="margin: 2px 0;"><strong>Rute Paket:</strong> ${shipment.pelabuhan_asal} &rarr; ${shipment.pelabuhan_tujuan}</p>
                  <p style="margin: 2px 0; font-size: 11px; color: #9ca3af;"><strong>Kargo:</strong> ${cargoSummary}</p>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    Swal.fire({
      title: 'Detail Rute Pengiriman',
      html: popupHtml,
      icon: 'info',
      background: '#151922',
      theme: 'dark',
      color: '#ffffff',
      confirmButtonColor: '#a855f7',
      confirmButtonText: 'Tutup'
    });
  };

  const handleCompleteRoute = async (route: any) => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Rute Selesai',
      text: `Apakah Anda yakin ingin menyelesaikan rute ini? Semua paket (${route.shipments.length} paket) di kapal ${route.ship} akan diubah statusnya menjadi Terkirim.`,
      icon: 'question',
      background: '#151922',
      color: '#ffffff',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Ya, Selesai',
      cancelButtonText: 'Batal',
      theme: 'dark'
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: 'Memproses...',
      allowOutsideClick: false,
      theme: 'dark',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const supabase = createClient();
      const shipmentIds = route.shipments.map((s: any) => s.id);

      const { error } = await supabase
        .from('pengiriman')
        .update({ status: 'Terkirim' })
        .in('id', shipmentIds);

      if (error) throw error;

      // Insert notifications for all shipments in this route
      const notifications = route.shipments.map((s: any) => ({
        title: 'Pengiriman Selesai',
        message: `Pengiriman dengan Resi ${s.nomor_resi || `AO-${s.id}`} telah selesai & terkirim ke tujuan.`,
        icon: 'CheckIcon',
        icon_color: 'text-green-500'
      }));

      await supabase.from('notifikasi').insert(notifications);

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Rute selesai! Status ${route.shipments.length} paket telah diubah menjadi Terkirim.`,
        confirmButtonColor: '#10b981',
        theme: 'dark'
      });

      fetchRoutes();
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        theme: 'dark',
        text: err.message || 'Terjadi kesalahan saat menyelesaikan rute.'
      });
    }
  };

  return (
    <main className="mx-auto px-6 py-10 relative z-10 w-full max-w-[1500px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Manajemen Rute</h2>
          <p className="text-gray-400 text-xs tracking-wider">Kelola rute perjalanan kapal</p>
        </div>
      </div>

      <div className="space-y-4 mb-20">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-[#151922] border border-white/5 rounded-[10px] flex flex-col">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-white/5 animate-pulse border border-white/5 shrink-0" />
                    <div className="space-y-2">
                      <div className="w-36 h-4 bg-white/5 animate-pulse rounded" />
                      <div className="w-20 h-3 bg-white/5 animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="w-20 h-6 bg-white/5 animate-pulse rounded" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-4">
                  <div className="flex gap-2 items-start md:col-span-2">
                    <div className="w-4 h-4 bg-white/5 animate-pulse rounded-full shrink-0" />
                    <div className="space-y-2">
                      <div className="w-12 h-2.5 bg-white/5 animate-pulse rounded" />
                      <div className="w-32 h-4 bg-white/5 animate-pulse rounded" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start">
                    <div className="w-4 h-4 bg-white/5 animate-pulse rounded-full shrink-0" />
                    <div className="space-y-2">
                      <div className="w-12 h-2.5 bg-white/5 animate-pulse rounded" />
                      <div className="w-28 h-4 bg-white/5 animate-pulse rounded" />
                    </div>
                  </div>

                  <div>
                    <div className="w-12 h-2.5 bg-white/5 animate-pulse rounded mb-2" />
                    <div className="w-16 h-3 bg-white/5 animate-pulse rounded" />
                  </div>
                  
                  <div>
                    <div className="w-12 h-2.5 bg-white/5 animate-pulse rounded mb-2" />
                    <div className="w-16 h-3 bg-white/5 animate-pulse rounded" />
                  </div>
                  
                  <div>
                    <div className="w-12 h-2.5 bg-white/5 animate-pulse rounded mb-2" />
                    <div className="w-10 h-3 bg-white/5 animate-pulse rounded" />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 px-6 py-4 flex justify-end gap-3 mt-auto">
                <div className="w-16 h-8 bg-white/5 animate-pulse rounded" />
              </div>
            </div>
          ))
        ) : routes.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-lg border-dashed">
            <p className="text-gray-500 text-sm font-mono">Belum ada rute aktif. Rute akan terbentuk otomatis untuk setiap 5 pengiriman berstatus Kirim.</p>
          </div>
        ) : (
          routes.map((route, idx) => (
            <div key={idx} className="bg-[#151922] border border-white/5 rounded-[10px] flex flex-col hover:border-white/10 transition-colors">
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-[#b06aee]/10 flex items-center justify-center border border-[#b06aee]/30 shrink-0">
                      <RoutePathIcon className="w-5 h-5 text-[#b06aee]" />
                    </div>
                    <div>
                      <h3 className="text-gray-200 font-bold tracking-wider text-sm">{route.ship}</h3>
                      <p className="text-[11px] text-gray-500 font-mono mt-1">Route ID: {route.routeId}</p>
                    </div>
                  </div>
                  
                  <div className={`px-2.5 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase bg-[#3b82f6]/10 text-[#3b82f6]`}>
                    {route.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-4">
                  <div className="flex gap-2 items-start md:col-span-2">
                    <MapPinIcon className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-500 mb-1">Origin</p>
                      <p className="text-gray-200 font-bold text-sm tracking-wide">{route.origin}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 items-start">
                    <PaperAirplaneIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-gray-500 mb-1">Destination</p>
                      <p className="text-gray-200 font-bold text-sm tracking-wide">{route.destination}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Distance</p>
                    <p className="text-gray-200 font-bold text-xs">{route.distance}</p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Duration</p>
                    <p className="text-gray-200 font-bold text-xs">{route.duration}</p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Waypoints</p>
                    <p className="text-gray-200 font-bold text-xs">{route.waypoints}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 px-6 py-4 flex justify-end gap-3 mt-auto">
                <button 
                  onClick={() => handleCompleteRoute(route)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-bold rounded transition-colors tracking-wide"
                >
                  <CheckIcon className="w-3.5 h-3.5" /> Selesai
                </button>
                <button 
                  onClick={() => handleViewRoute(route)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#1c1825] border border-[#b06aee]/30 text-[#b06aee] hover:bg-[#b06aee]/20 text-[11px] font-bold rounded transition-colors tracking-wide"
                >
                  <EyeIcon className="w-3.5 h-3.5" /> View
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { 
  PlusCircleIcon,
  ListBulletIcon,
  CubeIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  UserCircleIcon,
  ArrowDownOnSquareIcon,
  PaperAirplaneIcon,
  TrashIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import Swal from 'sweetalert2';

// cara connect db
const supabase = createClient();

const CARGO_TYPES = [
  { value: 'Elektronik', label: 'Elektronik', rateKg: 15000, rateM3: 70000 },
  { value: 'Furniture', label: 'Furniture', rateKg: 8000, rateM3: 40000 },
  { value: 'Bahan Kimia', label: 'Bahan Kimia (Chemicals)', rateKg: 20000, rateM3: 100000 },
  { value: 'Kendaraan', label: 'Kendaraan (Vehicles)', rateKg: 12000, rateM3: 60000 },
  { value: 'Kargo Umum', label: 'Kargo Umum (General Cargo)', rateKg: 6000, rateM3: 30000 }
];


export default function PengelolaanPengirimanPage() {
  const [activeTab, setActiveTab] = useState('kelola');
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  

  const [ports, setPorts] = useState<any[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);


  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('manual');


  const [formData, setFormData] = useState({
     nama: '', email: '', telepon: '', alamatPengirim: '',
     namaPenerima: '', emailPenerima: '', teleponPenerima: '', alamatPenerima: '',
     asal: '', tujuan: '', tanggal: '', catatan: ''
  });


  const [cart, setCart] = useState<any[]>([]);
  const [useInsurance, setUseInsurance] = useState(false);


  const [itemForm, setItemForm] = useState({
    jenis: 'Kargo Umum',
    berat: '',
    volume: '',
    deskripsi: '',
    catatanBarang: ''
  });

  const fetchRequests = async () => {
    try {
      const { data, error } = await // cara ambil data di db
 supabase.from('pengiriman').select('*, detail_barang(*, asuransi_barang(*))');

      if (data && !error) {
        const formatted = data.map((shipment: any) => {
          const items = shipment.detail_barang || [];
          const totalWeightVal = items.reduce((sum: number, item: any) => sum + (parseFloat(item.berat_kg) || 0), 0);
          const totalVolumeVal = items.reduce((sum: number, item: any) => sum + (parseFloat(item.volume_m3) || 0), 0);
          const itemTypes = Array.from(new Set(items.map((item: any) => item.jenis_barang))).join(', ') || 'General Cargo';
          
          return {
            id: shipment.nomor_resi || `AO-${shipment.id}`,
            dbId: shipment.id,
            status: shipment.status || 'Menunggu Persetujuan',
            type: itemTypes,
            customer: shipment.nama_pengirim || '-',
            penerima: shipment.nama_penerima || '-',
            route: `${shipment.pelabuhan_asal} → ${shipment.pelabuhan_tujuan}`,
            date: shipment.tanggal_pengiriman ? shipment.tanggal_pengiriman.split('-').reverse().join('/') : '-',
            cargo: `${totalWeightVal}kg / ${totalVolumeVal ? totalVolumeVal + 'm³' : '-'}`,
            rawShipment: shipment
          };
        });
        setRequests(formatted);
      } else if (error) {
        console.error("Error fetching shipments:", error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await // cara ambil data user di db
 supabase.from('user').select('id, username, nama_lengkap, email, no_telepon, alamat')
        .order('nama_lengkap', { ascending: true });

      if (data && !error) {
        setCustomers(data);
      }
    } catch (e) {
      console.error("Failed to load customers:", e);
    }
  };

  const fetchPorts = async () => {
    try {
      const { data, error } = await // cara ambil data di db
 supabase.from('pelabuhan').select('id, nama_pelabuhan, kota')
        .order('nama_pelabuhan', { ascending: true });
      if (data && !error) {
        setPorts(data);
      }
    } catch (e) {
      console.error("Failed to load ports:", e);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchCustomers();
    fetchPorts();
  }, []);

  const handleViewDetails = (req: any) => {
    const raw = req.rawShipment;
    if (!raw) return;

    const items = raw.detail_barang || [];
    

    const hasInsurance = items.some((item: any) => item.asuransi_barang && item.asuransi_barang.length > 0);
    const insurancePremi = hasInsurance ? items.reduce((sum: number, item: any) => {
      const premis = item.asuransi_barang || [];
      return sum + premis.reduce((s: number, p: any) => s + (parseFloat(p.premi_asuransi) || 0), 0);
    }, 0) : 0;


    const totalCargoCost = items.reduce((sum: number, item: any) => {
      const jenis = item.jenis_barang || 'Kargo Umum';
      const cargoTypeObj = CARGO_TYPES.find(c => c.value === jenis) || CARGO_TYPES[4];
      const beratVal = parseFloat(item.berat_kg) || 0;
      const volumeVal = parseFloat(item.volume_m3) || 0;
      return sum + (beratVal * cargoTypeObj.rateKg) + (volumeVal * cargoTypeObj.rateM3);
    }, 0);

    const subtotal = totalCargoCost + insurancePremi;

    const popupHtml = `
      <style>
        .custom-swal-content::-webkit-scrollbar {
          width: 6px;
        }
        .custom-swal-content::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 3px;
        }
        .custom-swal-content::-webkit-scrollbar-thumb {
          background: rgba(176, 106, 238, 0.4);
          border-radius: 3px;
        }
        .custom-swal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(176, 106, 238, 0.6);
        }
      </style>
      <div class="custom-swal-content" style="text-align: left; font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #d1d5db; max-height: 420px; overflow-y: auto; padding-right: 8px; scrollbar-width: thin; scrollbar-color: rgba(176,106,238,0.3) rgba(255,255,255,0.02);">
        
        <!-- Header Info (Resi & Status Badges) -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; margin-bottom: 12px;">
          <div>
            <span style="font-size: 10px; color: #9ca3af; font-family: monospace; display: block; margin-bottom: 2px;">NOMOR RESI</span>
            <span style="font-family: monospace; color: #c084fc; font-weight: bold; font-size: 13px; background: rgba(176,106,238,0.1); border: 1px solid rgba(176,106,238,0.25); padding: 3px 8px; border-radius: 4px; letter-spacing: 0.5px;">${raw.nomor_resi}</span>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10px; color: #9ca3af; font-family: monospace; display: block; margin-bottom: 2px;">STATUS</span>
            <span style="font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; background: ${raw.status === 'Disetujui' ? 'rgba(59,130,246,0.15)' : raw.status === 'Dalam Perjalanan' || raw.status === 'Kirim' ? 'rgba(6,182,214,0.15)' : raw.status === 'Terkirim' ? 'rgba(16,185,129,0.15)' : 'rgba(234,179,8,0.15)'}; color: ${raw.status === 'Disetujui' ? '#60a5fa' : raw.status === 'Dalam Perjalanan' || raw.status === 'Kirim' ? '#22d3ee' : raw.status === 'Terkirim' ? '#34d399' : '#facc15'}; border: 1px solid ${raw.status === 'Disetujui' ? 'rgba(59,130,246,0.3)' : raw.status === 'Dalam Perjalanan' || raw.status === 'Kirim' ? 'rgba(6,182,214,0.3)' : raw.status === 'Terkirim' ? 'rgba(16,185,129,0.3)' : 'rgba(234,179,8,0.3)'};">${raw.status || 'Menunggu Persetujuan'}</span>
          </div>
        </div>

        <!-- Rute & Tanggal -->
        <div style="display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; margin-bottom: 12px; background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.04);">
          <div>
            <strong style="color: #9ca3af; font-size: 9px; display: block; margin-bottom: 3px; font-family: monospace; letter-spacing: 0.5px;">RUTE PELABUHAN</strong>
            <span style="font-weight: bold; color: #ffffff; font-size: 12px; display: flex; align-items: center; gap: 4px;">
              ${raw.pelabuhan_asal.split(',')[0]} 
              <span style="color: #b06aee; font-size: 14px;">&rarr;</span> 
              ${raw.pelabuhan_tujuan.split(',')[0]}
            </span>
          </div>
          <div>
            <strong style="color: #9ca3af; font-size: 9px; display: block; margin-bottom: 3px; font-family: monospace; letter-spacing: 0.5px;">TANGGAL PENGIRIMAN</strong>
            <span style="font-weight: bold; color: #ffffff; font-family: monospace; font-size: 12px;">${raw.tanggal_pengiriman ? raw.tanggal_pengiriman.split('-').reverse().join('/') : '-'}</span>
          </div>
        </div>

        <!-- Pengirim & Penerima -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; margin-bottom: 12px;">
          <div>
            <h5 style="font-weight: bold; color: #a855f7; margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace; border-left: 2px solid #a855f7; padding-left: 6px;">Pengirim</h5>
            <p style="margin: 3px 0; line-height: 1.3;"><strong>Nama:</strong> ${raw.nama_pengirim || '-'}</p>
            <p style="margin: 3px 0; line-height: 1.3;"><strong>Telp:</strong> ${raw.nomor_telepon_pengirim || '-'}</p>
            <p style="margin: 3px 0; line-height: 1.3;"><strong>Email:</strong> <span style="font-size: 11px; word-break: break-all; color: #9ca3af;">${raw.email_pengirim || '-'}</span></p>
            <p style="margin: 3px 0; line-height: 1.3; color: #9ca3af;"><strong>Alamat:</strong> ${raw.alamat_pengirim || '-'}</p>
          </div>
          <div>
            <h5 style="font-weight: bold; color: #3b82f6; margin: 0 0 6px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; font-family: monospace; border-left: 2px solid #3b82f6; padding-left: 6px;">Penerima</h5>
            <p style="margin: 3px 0; line-height: 1.3;"><strong>Nama:</strong> ${raw.nama_penerima || '-'}</p>
            <p style="margin: 3px 0; line-height: 1.3;"><strong>Telp:</strong> ${raw.nomor_telepon_penerima || '-'}</p>
            <p style="margin: 3px 0; line-height: 1.3;"><strong>Email:</strong> <span style="font-size: 11px; word-break: break-all; color: #9ca3af;">${raw.email_penerima || '-'}</span></p>
            <p style="margin: 3px 0; line-height: 1.3; color: #9ca3af;"><strong>Alamat:</strong> ${raw.alamat_penerima || '-'}</p>
          </div>
        </div>

        <!-- Daftar Barang -->
        <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; margin-bottom: 12px;">
          <h5 style="font-weight: bold; color: #ffffff; margin: 0 0 8px 0; font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 0.5px;">Daftar Barang (${items.length})</h5>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.12); color: #9ca3af; text-align: left;">
                <th style="padding: 6px 4px; font-weight: 600; width: 50%;">Barang / Deskripsi</th>
                <th style="padding: 6px 4px; font-weight: 600; text-align: right; width: 25%;">Berat & Vol</th>
                <th style="padding: 6px 4px; font-weight: 600; text-align: right; width: 25%;">Estimasi Biaya</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item: any) => {
                const jenis = item.jenis_barang || 'Kargo Umum';
                const cargoTypeObj = CARGO_TYPES.find(c => c.value === jenis) || CARGO_TYPES[4];
                const beratVal = parseFloat(item.berat_kg) || 0;
                const volumeVal = parseFloat(item.volume_m3) || 0;
                const cost = (beratVal * cargoTypeObj.rateKg) + (volumeVal * cargoTypeObj.rateM3);
                
                return `
                  <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                    <td style="padding: 8px 4px; color: #ffffff; vertical-align: top;">
                      <strong style="color: #e2e8f0; font-size: 11px;">${jenis}</strong><br/>
                      <span style="color: #8c94a3; font-size: 10px; display: block; margin-top: 2px;">${item.deskripsi_barang || '-'}</span>
                      ${item.catatan_tambahan ? `<span style="display: block; color: #a855f7; font-size: 9px; font-style: italic; margin-top: 2px;">Note: ${item.catatan_tambahan}</span>` : ''}
                    </td>
                    <td style="padding: 8px 4px; text-align: right; font-family: monospace; color: #cbd5e1; vertical-align: top; line-height: 1.3;">
                      ${item.berat_kg} kg<br/>
                      <span style="color: #64748b; font-size: 10px;">${item.volume_m3 || 0} m³</span>
                    </td>
                    <td style="padding: 8px 4px; text-align: right; font-family: monospace; color: #ffffff; font-weight: 600; vertical-align: top;">
                      Rp ${cost.toLocaleString('id-ID')}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Ringkasan Biaya -->
        <div style="background: rgba(176,106,238,0.03); border: 1px dashed rgba(176,106,238,0.15); padding: 12px; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #9ca3af;">
            <span>Biaya Kargo Utama:</span>
            <span style="font-family: monospace; font-weight: 600; color: #e2e8f0;">Rp ${totalCargoCost.toLocaleString('id-ID')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #9ca3af;">
            <span>Premi Asuransi:</span>
            <span style="font-family: monospace; font-weight: 600; color: #e2e8f0;">${hasInsurance ? `Rp ${insurancePremi.toLocaleString('id-ID')}` : 'Rp 0'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; color: #c084fc; font-size: 14px; margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(176,106,238,0.25);">
            <span style="font-family: monospace; letter-spacing: 0.5px; text-transform: uppercase; font-size: 11px;">Total Tagihan:</span>
            <span style="font-family: monospace; color: #ffffff; font-size: 15px; text-shadow: 0 0 10px rgba(176,106,238,0.3);">Rp ${subtotal.toLocaleString('id-ID')}</span>
          </div>
        </div>

      </div>
    `;

    Swal.fire({
      title: 'Detail Pengiriman',
      html: popupHtml,
      icon: 'info',
      background: '#151922',
      color: '#ffffff',
      confirmButtonColor: '#a855f7',
      confirmButtonText: 'Tutup'
    });
  };

  const handleApprove = async (req: any) => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Persetujuan',
      text: `Apakah Anda yakin ingin menyetujui pengiriman dengan Resi ${req.id}?`,
      icon: 'question',
      background: '#151922',
      color: '#ffffff',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Ya, Setujui',
      cancelButtonText: 'Batal'
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: 'Memproses...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const { error } = await // cara perbarui data di db
 supabase.from('pengiriman').update({ status: 'Disetujui' })
        .eq('id', req.dbId);

      if (error) throw error;

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Pengiriman dengan Resi ${req.id} telah disetujui.`,
        confirmButtonColor: '#10b981'
      });

      fetchRequests();
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message || 'Terjadi kesalahan saat menyetujui pengiriman.'
      });
    }
  };

  const handleReject = async (req: any) => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Penolakan',
      text: `Apakah Anda yakin ingin menolak & menghapus pengiriman dengan Resi ${req.id}?`,
      icon: 'warning',
      background: '#151922',
      color: '#ffffff',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Ya, Tolak & Hapus',
      cancelButtonText: 'Batal'
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: 'Memproses...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const dbId = req.dbId;

      const { data: barangList, error: errBarangFetch } = await // cara ambil data di db
 supabase.from('detail_barang').select('id')
        .eq('pengiriman_id', dbId);

      if (errBarangFetch) throw errBarangFetch;

      const barangIds = (barangList || []).map((b: any) => b.id);

      if (barangIds.length > 0) {

        const { error: errInsDelete } = await // cara hapus data di db
 supabase.from('asuransi_barang').delete()
          .in('barang_id', barangIds);
        if (errInsDelete) throw errInsDelete;
      }


      const { error: errBarangDelete } = await // cara hapus data di db
 supabase.from('detail_barang').delete()
        .eq('pengiriman_id', dbId);
      if (errBarangDelete) throw errBarangDelete;


      const { error: errDetailDelete } = await // cara hapus data di db
 supabase.from('detail_pengiriman').delete()
        .eq('id_pengiriman', dbId);
      if (errDetailDelete) throw errDetailDelete;


      const { error: errShipmentDelete } = await // cara hapus data di db
 supabase.from('pengiriman').delete()
        .eq('id', dbId);
      if (errShipmentDelete) throw errShipmentDelete;

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Pengiriman dengan Resi ${req.id} telah ditolak dan dihapus.`,
        confirmButtonColor: '#ef4444'
      });

      fetchRequests();
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message || 'Terjadi kesalahan saat menolak pengiriman.'
      });
    }
  };

  const handleKirim = async (req: any) => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Pengiriman',
      text: `Apakah Anda yakin ingin mengirim paket dengan Resi ${req.id}?`,
      icon: 'question',
      background: '#151922',
      color: '#ffffff',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Ya, Kirim',
      cancelButtonText: 'Batal'
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: 'Memproses...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const { error } = await // cara perbarui data di db
 supabase.from('pengiriman').update({ status: 'Kirim' })
        .eq('id', req.dbId);

      if (error) throw error;

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Pengiriman dengan Resi ${req.id} statusnya diubah menjadi Kirim.`,
        confirmButtonColor: '#10b981'
      });

      fetchRequests();
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.message || 'Terjadi kesalahan saat mengirim paket.'
      });
    }
  };



  const handleCustomerChange = (idStr: string) => {
    setSelectedCustomerId(idStr);
    if (idStr === 'manual') {
      setFormData(prev => ({
        ...prev,
        nama: '', email: '', telepon: '', alamatPengirim: ''
      }));
    } else {
      const cust = customers.find(c => String(c.id) === idStr);
      if (cust) {
        setFormData(prev => ({
          ...prev,
          nama: cust.nama_lengkap || cust.username || '',
          email: cust.email || '',
          telepon: cust.no_telepon || '',
          alamatPengirim: cust.alamat || ''
        }));
      }
    }
  };


  const handleAddItem = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!itemForm.berat || parseFloat(itemForm.berat) <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Input Tidak Valid',
        text: 'Berat barang harus lebih besar dari 0!'
      });
      return;
    }

    if (!itemForm.deskripsi.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Input Tidak Valid',
        text: 'Deskripsi kargo tidak boleh kosong!'
      });
      return;
    }

    const typeObj = CARGO_TYPES.find(c => c.value === itemForm.jenis) || CARGO_TYPES[4];
    const beratVal = parseFloat(itemForm.berat) || 0;
    const volumeVal = parseFloat(itemForm.volume) || 0;

    const cargoCost = (beratVal * typeObj.rateKg) + (volumeVal * typeObj.rateM3);

    if (editingItemId) {
      setCart(cart.map(item => item.id === editingItemId ? {
        ...item,
        jenis: itemForm.jenis,
        berat: beratVal,
        volume: volumeVal,
        deskripsi: itemForm.deskripsi,
        catatan: itemForm.catatanBarang,
        cargoCost: cargoCost
      } : item));
      setEditingItemId(null);

      Swal.fire({
        icon: 'success',
        title: 'Barang Diperbarui',
        text: 'Detail barang berhasil diperbarui!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      const newItem = {
        id: Date.now() + Math.random().toString(36).substring(2, 7),
        jenis: itemForm.jenis,
        berat: beratVal,
        volume: volumeVal,
        deskripsi: itemForm.deskripsi,
        catatan: itemForm.catatanBarang,
        cargoCost: cargoCost
      };

      setCart([...cart, newItem]);
    }

    setItemForm({
      jenis: itemForm.jenis,
      berat: '',
      volume: '',
      deskripsi: '',
      catatanBarang: ''
    });
  };

  const handleEditItemClick = (item: any) => {
    setEditingItemId(item.id);
    setItemForm({
      jenis: item.jenis,
      berat: String(item.berat),
      volume: String(item.volume),
      deskripsi: item.deskripsi,
      catatanBarang: item.catatan || ''
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };


  const totalWeight = cart.reduce((sum, item) => sum + item.berat, 0);
  const totalVolume = cart.reduce((sum, item) => sum + item.volume, 0);
  const totalCargoCost = cart.reduce((sum, item) => sum + item.cargoCost, 0);
  const totalInsuranceCost = useInsurance ? Math.max(10000, Math.round(totalCargoCost * 0.005)) : 0;
  const subtotal = totalCargoCost + totalInsuranceCost;

  const handleReset = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCart([]);
    setUseInsurance(false);
    setSelectedCustomerId('manual');
    setFormData({
      nama: '', email: '', telepon: '', alamatPengirim: '',
      namaPenerima: '', emailPenerima: '', teleponPenerima: '', alamatPenerima: '',
      asal: '', tujuan: '', tanggal: '', catatan: ''
    });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Keranjang Kosong',
        text: 'Silakan tambahkan minimal satu barang ke keranjang!'
      });
      return;
    }


    const portAsalObj = ports.find(p => String(p.id) === formData.asal);
    const portTujuanObj = ports.find(p => String(p.id) === formData.tujuan);
    const portAsalText = portAsalObj ? `${portAsalObj.nama_pelabuhan}, ${portAsalObj.kota}` : formData.asal;
    const portTujuanText = portTujuanObj ? `${portTujuanObj.nama_pelabuhan}, ${portTujuanObj.kota}` : formData.tujuan;


    const popupHtml = `
      <div style="text-align: left; font-family: system-ui, -apple-system, sans-serif; font-size: 13px; color: #d1d5db; max-height: 380px; overflow-y: auto; padding-right: 5px;">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; margin-bottom: 12px;">
          <h4 style="font-weight: bold; color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">Informasi Rute & Pengiriman (Admin Panel)</h4>
          <p style="margin: 3px 0;"><strong>Pengirim:</strong> ${formData.nama} (${formData.telepon})</p>
          <p style="margin: 3px 0;"><strong>Penerima:</strong> ${formData.namaPenerima} (${formData.teleponPenerima || '-'})</p>
          <p style="margin: 3px 0;"><strong>Rute:</strong> ${portAsalText} &rarr; ${portTujuanText}</p>
          <p style="margin: 3px 0;"><strong>Tanggal:</strong> ${formData.tanggal}</p>
        </div>
        <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; margin-bottom: 12px;">
          <h4 style="font-weight: bold; color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">Daftar Kargo (${cart.length} Item)</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08); color: #9ca3af; text-align: left;">
                <th style="padding: 4px 0; font-weight: 600;">Barang</th>
                <th style="padding: 4px 0; font-weight: 600; text-align: right;">Berat/Vol</th>
                <th style="padding: 4px 0; font-weight: 600; text-align: right;">Biaya Kargo</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map((item) => `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                  <td style="padding: 6px 0; color: #ffffff;">
                    <strong>${item.jenis}</strong><br/>
                    <span style="color: #6b7280; font-size: 10px;">${item.deskripsi}</span>
                  </td>
                  <td style="padding: 6px 0; text-align: right; font-family: monospace;">${item.berat} kg<br/>${item.volume || 0} m³</td>
                  <td style="padding: 6px 0; text-align: right; font-family: monospace; color: #ffffff;">Rp ${item.cargoCost.toLocaleString('id-ID')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #9ca3af; font-size: 12px;">
            <span>Total Kargo Cost:</span>
            <span style="font-family: monospace;">Rp ${totalCargoCost.toLocaleString('id-ID')}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; color: #9ca3af; font-size: 12px;">
            <span>Asuransi Pengiriman:</span>
            <span style="font-family: monospace;">${useInsurance ? `Ya (Rp ${totalInsuranceCost.toLocaleString('id-ID')})` : 'Tidak (Rp 0)'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; color: #c084fc; font-size: 15px; margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(255,255,255,0.15);">
            <span>Subtotal Tagihan:</span>
            <span style="font-family: monospace; color: #ffffff;">Rp ${subtotal.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    `;

    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Rincian Pesanan (Admin)',
      html: popupHtml,
      icon: 'info',
      background: '#151922',
      color: '#ffffff',
      showCancelButton: true,
      confirmButtonColor: '#a855f7',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Konfirmasi & Kirim',
      cancelButtonText: 'Batal'
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: 'Menyimpan Pengiriman...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {

      const shippingYear = formData.tanggal ? new Date(formData.tanggal).getFullYear() : new Date().getFullYear();
      const itemCount = cart.length;
      const originPortId = formData.asal;
      const insuranceIndicator = useInsurance ? '1' : '0';
      const resi = `AO-${shippingYear}-${itemCount}${originPortId}${insuranceIndicator}`;
      

      const { data: shipment, error: errShipment } = await // cara memasukkan data ke db
 supabase.from('pengiriman').insert([{
          nomor_resi: resi,
          nama_pengirim: formData.nama,
          email_pengirim: formData.email,
          nomor_telepon_pengirim: formData.telepon,
          alamat_pengirim: formData.alamatPengirim,
          nama_penerima: formData.namaPenerima,
          email_penerima: formData.emailPenerima,
          nomor_telepon_penerima: formData.teleponPenerima,
          alamat_penerima: formData.alamatPenerima,
          pelabuhan_asal: portAsalText,
          pelabuhan_tujuan: portTujuanText,
          tanggal_pengiriman: formData.tanggal
        }])
        .select()
        .single();

      if (errShipment || !shipment) {
        throw new Error("Gagal menyimpan pengiriman: " + errShipment?.message);
      }


      const userId = selectedCustomerId !== 'manual' ? parseInt(selectedCustomerId) : 1;
      const { error: errDetail } = await // cara memasukkan data ke db
 supabase.from('detail_pengiriman').insert([{
          id_user: userId,
          id_pengiriman: shipment.id,
          subtotal: subtotal
        }]);

      if (errDetail) {
        throw new Error("Gagal menyimpan detail pengiriman: " + errDetail.message);
      }


      let firstInsertedBarangId = null;

      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const { data: insertedBarang, error: errBarang } = await // cara memasukkan data ke db
 supabase.from('detail_barang').insert([{
            pengiriman_id: shipment.id,
            jenis_barang: item.jenis,
            deskripsi_barang: item.deskripsi,
            berat_kg: item.berat,
            volume_m3: item.volume || null,
            catatan_tambahan: item.catatan || null
          }])
          .select()
          .single();

        if (errBarang || !insertedBarang) {
          throw new Error(`Gagal menyimpan barang (${item.jenis}): ` + errBarang?.message);
        }

        if (i === 0) {
          firstInsertedBarangId = insertedBarang.id;
        }
      }


      if (useInsurance && firstInsertedBarangId) {
        const polisNum = 'POL-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
        const { error: errIns } = await // cara memasukkan data ke db
 supabase.from('asuransi_barang').insert([{
            barang_id: firstInsertedBarangId,
            nomor_polis: polisNum,
            provider_asuransi: 'Anagata Proteksi Utama',
            nilai_pertanggungan: totalCargoCost * 10,
            premi_asuransi: totalInsuranceCost,
            status_asuransi: 'Aktif'
          }]);

        if (errIns) {
          console.error("Gagal mendaftarkan asuransi untuk pengiriman", errIns);
        }
      }

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        html: `Pengiriman dengan Resi <strong class="text-purple-400 font-mono">${resi}</strong> berhasil dibuat.`,
        confirmButtonColor: '#a855f7'
      });

      handleReset();
      fetchRequests();
      setActiveTab('kelola');

    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: error.message || 'Terjadi kesalahan saat menyimpan pengiriman.'
      });
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'Dalam Perjalanan' || status === 'Kirim') return 'bg-cyan-500/10 text-cyan-400';
    if (status === 'Disetujui') return 'bg-blue-500/10 text-blue-400';
    if (status === 'Menunggu Persetujuan') return 'bg-yellow-500/10 text-yellow-400';
    if (status === 'Terkirim') return 'bg-emerald-500/10 text-emerald-400';
    return 'bg-gray-500/10 text-gray-400';
  };

  const pendingCount = requests.filter(r => r.status === 'Menunggu Persetujuan').length;
  const approvedCount = requests.filter(r => r.status === 'Disetujui').length;
  const inTransitCount = requests.filter(r => r.status === 'Dalam Perjalanan' || r.status === 'Kirim').length;
  const deliveredCount = requests.filter(r => r.status === 'Terkirim').length;

  const filteredRequests = requests.filter(r => {
    const matchesFilter = 
      filter === 'ALL' || 
      r.status === filter || 
      (filter === 'Dalam Perjalanan' && r.status === 'Kirim');

    const raw = r.rawShipment || {};
    const items = raw.detail_barang || [];

    const matchesItems = items.some((item: any) => 
      (item.jenis_barang || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.deskripsi_barang || '').toLowerCase().includes(search.toLowerCase())
    );

    const matchesSearch = 
      (r.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (raw.nama_pengirim || '').toLowerCase().includes(search.toLowerCase()) ||
      (raw.nama_penerima || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.route || '').toLowerCase().includes(search.toLowerCase()) ||
      matchesItems;

    return matchesFilter && matchesSearch;
  });

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
            <h3 className="text-white font-bold text-sm tracking-wider mb-2">Form Pengiriman Barang (Admin)</h3>
            <p className="text-[#8c94a3] text-xs font-mono">Isi form di bawah untuk membuat request pengiriman baru atas nama Customer</p>
          </div>

          <form onSubmit={handleAddSubmit} onReset={handleReset} className="space-y-6">
            
            
            <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
                  <UserCircleIcon className="w-4 h-4 text-[#b06aee]" /> Informasi Pengirim
                </div>
                
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-400">Pilih Customer:</span>
                  <select
                    value={selectedCustomerId}
                    onChange={e => handleCustomerChange(e.target.value)}
                    className="bg-[#1b202c] border border-white/10 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#b06aee] font-mono cursor-pointer"
                  >
                    <option value="manual">-- Input Manual --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.nama_lengkap || c.username}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nama Pengirim <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={formData.nama}
                    onChange={e => setFormData({...formData, nama: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Email <span className="text-rose-500">*</span></label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nomor Telepon <span className="text-rose-500">*</span></label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.telepon}
                    onChange={e => setFormData({...formData, telepon: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Alamat</label>
                  <input 
                    type="text" 
                    value={formData.alamatPengirim}
                    onChange={e => setFormData({...formData, alamatPengirim: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
                  />
                </div>
              </div>
            </div>

            
            <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
                <ArrowDownOnSquareIcon className="w-4 h-4 text-[#3b82f6]" /> Informasi Penerima
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nama Penerima <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={formData.namaPenerima}
                    onChange={e => setFormData({...formData, namaPenerima: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Email</label>
                  <input 
                    type="email" 
                    value={formData.emailPenerima}
                    onChange={e => setFormData({...formData, emailPenerima: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nomor Telepon</label>
                  <input 
                    type="tel" 
                    value={formData.teleponPenerima}
                    onChange={e => setFormData({...formData, teleponPenerima: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Alamat</label>
                  <input 
                    type="text" 
                    value={formData.alamatPenerima}
                    onChange={e => setFormData({...formData, alamatPenerima: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
                  />
                </div>
              </div>
            </div>

            
            <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
                <MapPinIcon className="w-4 h-4 text-[#10b981]" /> Detail Pengiriman
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Pelabuhan Asal <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select 
                      required 
                      value={formData.asal}
                      onChange={e => setFormData({...formData, asal: e.target.value})}
                      className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 appearance-none cursor-pointer"
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
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Pelabuhan Tujuan <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select 
                      required 
                      value={formData.tujuan}
                      onChange={e => setFormData({...formData, tujuan: e.target.value})}
                      className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 appearance-none cursor-pointer"
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
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Tanggal <span className="text-rose-500">*</span></label>
                  <input 
                    type="date" 
                    required 
                    value={formData.tanggal}
                    onChange={e => setFormData({...formData, tanggal: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 font-mono tracking-tight" 
                  />
                </div>
              </div>
            </div>

            
            <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
                <CubeIcon className="w-4 h-4 text-[#10b981]" /> Input Kargo / Barang
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Jenis Barang *</label>
                  <div className="relative">
                    <select 
                      value={itemForm.jenis}
                      onChange={e => setItemForm({...itemForm, jenis: e.target.value})}
                      className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 appearance-none cursor-pointer"
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
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Berat Barang (kg) *</label>
                  <input 
                    type="number" 
                    value={itemForm.berat}
                    onChange={e => setItemForm({...itemForm, berat: e.target.value})}
                    placeholder="Berat dalam kg" 
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Volume Barang (m³)</label>
                  <input 
                    type="number" 
                    value={itemForm.volume}
                    onChange={e => setItemForm({...itemForm, volume: e.target.value})}
                    placeholder="Volume dalam m³" 
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Deskripsi Kargo/Barang *</label>
                  <input 
                    type="text" 
                    value={itemForm.deskripsi}
                    onChange={e => setItemForm({...itemForm, deskripsi: e.target.value})}
                    placeholder="Misal: Sparepart Mesin, Pipa Besi" 
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Catatan Tambahan untuk Barang</label>
                  <input 
                    type="text" 
                    value={itemForm.catatanBarang}
                    onChange={e => setItemForm({...itemForm, catatanBarang: e.target.value})}
                    placeholder="Fragile, Jangan ditumpuk, dll" 
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                {editingItemId && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingItemId(null);
                      setItemForm({
                        jenis: 'Kargo Umum',
                        berat: '',
                        volume: '',
                        deskripsi: '',
                        catatanBarang: ''
                      });
                    }}
                    className="bg-gray-700/80 hover:bg-gray-600 border border-white/5 text-gray-200 px-5 py-2 rounded-md font-bold text-xs tracking-wider transition-all"
                  >
                    Batal Edit
                  </button>
                )}
                <button 
                  type="button"
                  onClick={handleAddItem}
                  className="bg-[#b06aee]/10 border border-[#b06aee]/30 text-[#b06aee] hover:bg-[#b06aee]/20 px-5 py-2 rounded-md font-bold text-xs tracking-wider flex items-center gap-1.5 transition-all"
                >
                  {editingItemId ? 'Simpan Perubahan' : '+ Tambah ke Keranjang'}
                </button>
              </div>
            </div>

            
            <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
                  <CubeIcon className="w-4 h-4 text-[#a855f7]" /> Keranjang Kargo Admin (${cart.length} Barang)
                </div>
                {cart.length > 0 && (
                  <span className="text-[10px] text-gray-400 font-mono">
                    Total Berat: <strong>{totalWeight} kg</strong> | Total Vol: <strong>{totalVolume} m³</strong>
                  </span>
                )}
              </div>

              <div className="border border-white/5 rounded-md overflow-hidden">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="bg-white/5 text-gray-300 font-bold border-b border-white/5">
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">Jenis & Deskripsi</th>
                      <th className="px-4 py-3 text-right">Berat</th>
                      <th className="px-4 py-3 text-right">Volume</th>
                      <th className="px-4 py-3 text-right">Biaya Kargo</th>
                      <th className="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-400">
                    {cart.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500 font-mono">
                          Keranjang kargo kosong. Silakan tambahkan barang di atas.
                        </td>
                      </tr>
                    ) : (
                      cart.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-white/[0.01]">
                          <td className="px-4 py-3 text-gray-300">{idx + 1}</td>
                          <td className="px-4 py-3 text-gray-200">
                            <span className="font-bold text-white">{item.jenis}</span>
                            <div className="text-[10px] text-gray-500 mt-0.5">{item.deskripsi}</div>
                            {item.catatan && <div className="text-[9px] text-purple-400/80 mt-0.5">Note: {item.catatan}</div>}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-300">{item.berat} kg</td>
                          <td className="px-4 py-3 text-right text-gray-300">{item.volume || 0} m³</td>
                          <td className="px-4 py-3 text-right text-white font-bold">Rp {item.cargoCost.toLocaleString('id-ID')}</td>
                          <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                            <button 
                              type="button" 
                              onClick={() => handleEditItemClick(item)}
                              className="p-1 hover:text-blue-400 text-gray-500 transition-colors"
                              title="Edit Item"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-1 hover:text-rose-400 text-gray-500 transition-colors"
                              title="Hapus Item"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              
              {cart.length > 0 && (
                <div className="mt-4 p-4 bg-[#1b202c] border border-white/5 rounded-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={useInsurance}
                      onChange={e => setUseInsurance(e.target.checked)}
                      className="rounded bg-[#151922] border-white/5 text-[#a855f7] focus:ring-offset-[#1b202c] focus:ring-[#a855f7]"
                    />
                    <span className="text-xs font-bold text-gray-300 font-mono flex items-center gap-1.5">
                      <ShieldCheckIcon className="w-4 h-4 text-[#a855f7]" /> Gunakan Asuransi Pengiriman (+0.5% dari Total Biaya Kargo, Min Rp 10.000)
                    </span>
                  </label>
                  {useInsurance && (
                    <span className="text-xs font-mono text-purple-400 font-bold">
                      Premi: Rp {totalInsuranceCost.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mt-4 p-4 border border-white/5 rounded-md bg-white/[0.01] flex justify-end gap-10 text-xs font-mono">
                  <div className="text-right space-y-1.5 text-gray-400">
                    <div>Total Biaya Kargo:</div>
                    <div>Asuransi Pengiriman:</div>
                    <div className="text-sm font-bold text-white pt-1.5 border-t border-dashed border-white/10">Total Tagihan (Subtotal):</div>
                  </div>
                  <div className="text-right space-y-1.5 text-gray-200 font-bold">
                    <div>Rp {totalCargoCost.toLocaleString('id-ID')}</div>
                    <div>{useInsurance ? `Rp ${totalInsuranceCost.toLocaleString('id-ID')}` : 'Rp 0'}</div>
                    <div className="text-sm font-black text-purple-400 pt-1.5 border-t border-dashed border-white/10">Rp {subtotal.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              )}
            </div>

            
            <div className="flex justify-end gap-3 mt-8 pb-10">
              <button 
                type="button" 
                onClick={handleReset}
                className="px-6 py-2 rounded-md bg-[#6b21a8]/25 text-purple-300 border border-[#b06aee]/20 hover:bg-[#6b21a8]/40 transition-colors font-bold text-xs tracking-wider shadow"
              >
                Reset Form
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 rounded-md bg-[#a855f7] hover:bg-[#9333ea] text-white transition-colors font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2"
              >
                <PaperAirplaneIcon className="w-4 h-4" /> Submit Pengiriman
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
              {loading ? <div className="h-6 w-10 bg-white/5 animate-pulse rounded" /> : <span className="text-2xl font-bold text-white font-mono">{requests.length}</span>}
            </div>
            <div className="bg-[#151922] border border-white/5 rounded-lg p-5">
              <h4 className="text-gray-400 text-[10px] font-mono mb-2">Menunggu Persetujuan</h4>
              {loading ? <div className="h-6 w-10 bg-white/5 animate-pulse rounded" /> : <span className="text-2xl font-bold text-yellow-500 font-mono">{pendingCount}</span>}
            </div>
            <div className="bg-[#151922] border border-white/5 rounded-lg p-5">
              <h4 className="text-gray-400 text-[10px] font-mono mb-2">Disetujui</h4>
              {loading ? <div className="h-6 w-10 bg-white/5 animate-pulse rounded" /> : <span className="text-2xl font-bold text-blue-500 font-mono">{approvedCount}</span>}
            </div>
            <div className="bg-[#151922] border border-white/5 rounded-lg p-5">
              <h4 className="text-gray-400 text-[10px] font-mono mb-2">Dalam Perjalanan</h4>
              {loading ? <div className="h-6 w-10 bg-white/5 animate-pulse rounded" /> : <span className="text-2xl font-bold text-cyan-500 font-mono">{inTransitCount}</span>}
            </div>
            <div className="bg-[#151922] border border-white/5 rounded-lg p-5">
              <h4 className="text-gray-400 text-[10px] font-mono mb-2">Terkirim</h4>
              {loading ? <div className="h-6 w-10 bg-white/5 animate-pulse rounded" /> : <span className="text-2xl font-bold text-emerald-500 font-mono">{deliveredCount}</span>}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

            <div className="relative w-full md:w-80">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="text"
                placeholder="Cari Resi, Customer, Rute, Kargo..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#151922] border border-white/5 rounded-md pl-10 pr-4 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-[#151922] border border-white/5 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-28 h-4 bg-white/5 animate-pulse rounded" />
                        <div className="w-20 h-4 bg-white/5 animate-pulse rounded" />
                      </div>
                      <div className="w-20 h-3.5 bg-white/5 animate-pulse rounded" />
                    </div>
                    <div className="w-16 h-3.5 bg-white/5 animate-pulse rounded" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="space-y-2">
                      <div className="w-16 h-2.5 bg-white/5 animate-pulse rounded" />
                      <div className="w-32 h-3.5 bg-white/5 animate-pulse rounded ml-5" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-16 h-2.5 bg-white/5 animate-pulse rounded" />
                      <div className="w-32 h-3.5 bg-white/5 animate-pulse rounded ml-5" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-16 h-2.5 bg-white/5 animate-pulse rounded" />
                      <div className="w-36 h-3.5 bg-white/5 animate-pulse rounded ml-5" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-16 h-2.5 bg-white/5 animate-pulse rounded" />
                      <div className="w-24 h-3.5 bg-white/5 animate-pulse rounded ml-5" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-16 h-2.5 bg-white/5 animate-pulse rounded" />
                      <div className="w-20 h-3.5 bg-white/5 animate-pulse rounded ml-5" />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-20 border border-white/5 rounded-lg border-dashed">
                <p className="text-gray-500 text-sm font-mono">Tidak ada request ditemukan.</p>
              </div>
            ) : (
              filteredRequests.map((req, idx) => (
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
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleViewDetails(req)}
                        className="text-[#b06aee] text-[10px] font-bold tracking-wider hover:text-purple-300 transition-colors bg-white/5 px-2.5 py-1 rounded border border-white/5"
                      >
                        View Details
                      </button>
                      {req.status === 'Disetujui' && (
                        <button 
                          onClick={() => handleKirim(req)}
                          className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 px-3 py-1 rounded text-[10px] font-bold tracking-wider transition-colors shadow-[0_0_10px_rgba(14,165,233,0.1)]"
                        >
                          Kirim
                        </button>
                      )}
                      {req.status === 'Menunggu Persetujuan' && (
                        <>
                          <button 
                            onClick={() => handleApprove(req)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded text-[10px] font-bold tracking-wider transition-colors shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                          >
                            Setujui
                          </button>
                          <button 
                            onClick={() => handleReject(req)}
                            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded text-[10px] font-bold tracking-wider transition-colors shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 text-gray-500">
                        <UserIcon className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-mono uppercase tracking-wider">Customer</span>
                      </div>
                      <p className="text-gray-200 text-xs font-mono font-medium pl-5">{req.customer}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 text-gray-500">
                        <UserCircleIcon className="w-3.5 h-3.5 text-[#3b82f6]" />
                        <span className="text-[9px] font-mono uppercase tracking-wider">Penerima</span>
                      </div>
                      <p className="text-gray-200 text-xs font-mono font-medium pl-5">{req.penerima}</p>
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
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}

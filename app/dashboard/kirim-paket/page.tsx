"use client";

import React, { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  MapPinIcon, 
  CubeIcon,
  PaperAirplaneIcon,
  ArrowDownOnSquareIcon,
  TrashIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import Swal from 'sweetalert2';

const supabase = createClient();

const CARGO_TYPES = [
  { value: 'Elektronik', label: 'Elektronik', rateKg: 15000, rateM3: 70000 },
  { value: 'Furniture', label: 'Furniture', rateKg: 8000, rateM3: 40000 },
  { value: 'Bahan Kimia', label: 'Bahan Kimia (Chemicals)', rateKg: 20000, rateM3: 100000 },
  { value: 'Kendaraan', label: 'Kendaraan (Vehicles)', rateKg: 12000, rateM3: 60000 },
  { value: 'Kargo Umum', label: 'Kargo Umum (General Cargo)', rateKg: 6000, rateM3: 30000 }
];

export default function KirimPaketPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [ports, setPorts] = useState<any[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  // Shipment Info State
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

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const { data, error } = await supabase
          .from('pelabuhan')
          .select('id, nama_pelabuhan, kota')
          .order('nama_pelabuhan', { ascending: true });
        if (data && !error) {
          setPorts(data);
        }
      } catch (err) {
        console.error("Failed to fetch ports", err);
      }
    };
    fetchPorts();
  }, []);

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
        const parsed = JSON.parse(session);
        setCurrentUser(parsed);
        setFormData(prev => ({
          ...prev,
          nama: parsed.nama_lengkap || parsed.username || '',
          email: parsed.email || '',
          telepon: parsed.no_telepon || '',
          alamatPengirim: parsed.alamat || ''
        }));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
  }, []);

  // Handle adding or updating an item in the cart
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
        text: 'Deskripsi barang tidak boleh kosong!'
      });
      return;
    }

    const cargoTypeObj = CARGO_TYPES.find(c => c.value === itemForm.jenis) || CARGO_TYPES[4];
    const beratVal = parseFloat(itemForm.berat) || 0;
    const volumeVal = parseFloat(itemForm.volume) || 0;

    // Calculate cargo cost
    const cargoCost = (beratVal * cargoTypeObj.rateKg) + (volumeVal * cargoTypeObj.rateM3);

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
    
    // Reset item form except "jenis" dropdown
    setItemForm({
      jenis: itemForm.jenis,
      berat: '',
      volume: '',
      deskripsi: '',
      catatanBarang: ''
    });
  };

  // Set item to edit mode
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

  // Remove an item from the cart
  const handleRemoveItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Calculations for entire cart
  const totalWeight = cart.reduce((sum, item) => sum + item.berat, 0);
  const totalVolume = cart.reduce((sum, item) => sum + item.volume, 0);
  const totalCargoCost = cart.reduce((sum, item) => sum + item.cargoCost, 0);
  const totalInsuranceCost = useInsurance ? Math.max(10000, Math.round(totalCargoCost * 0.005)) : 0;
  const subtotal = totalCargoCost + totalInsuranceCost;

  // Handle entire shipment form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Keranjang Kosong',
        text: 'Silakan tambahkan minimal satu barang ke dalam keranjang sebelum mengirim!'
      });
      return;
    }

    if (!formData.nama.trim() || !formData.telepon.trim() || !formData.namaPenerima.trim() || !formData.asal.trim() || !formData.tujuan.trim() || !formData.tanggal) {
      Swal.fire({
        icon: 'warning',
        title: 'Data Belum Lengkap',
        text: 'Silakan isi semua data pengirim, penerima, dan detail rute yang berbintang (*)'
      });
      return;
    }

    // Resolve port names/cities from selected IDs
    const portAsalObj = ports.find(p => String(p.id) === formData.asal);
    const portTujuanObj = ports.find(p => String(p.id) === formData.tujuan);
    const portAsalText = portAsalObj ? `${portAsalObj.nama_pelabuhan}, ${portAsalObj.kota}` : formData.asal;
    const portTujuanText = portTujuanObj ? `${portTujuanObj.nama_pelabuhan}, ${portTujuanObj.kota}` : formData.tujuan;

    // Build the detail HTML table for the SweetAlert2 popup
    const popupHtml = `
      <div style="text-align: left; font-family: system-ui, -apple-system, sans-serif; font-size: 13px; color: #d1d5db; max-height: 380px; overflow-y: auto; padding-right: 5px;">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; margin-bottom: 12px;">
          <h4 style="font-weight: bold; color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">Informasi Rute & Pengiriman</h4>
          <p style="margin: 3px 0;"><strong>Pengirim:</strong> ${formData.nama} (${formData.telepon})</p>
          <p style="margin: 3px 0;"><strong>Penerima:</strong> ${formData.namaPenerima} (${formData.teleponPenerima || '-'})</p>
          <p style="margin: 3px 0;"><strong>Rute:</strong> ${portAsalText} &rarr; ${portTujuanText}</p>
          <p style="margin: 3px 0;"><strong>Tanggal:</strong> ${formData.tanggal}</p>
        </div>
        <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px; margin-bottom: 12px;">
          <h4 style="font-weight: bold; color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">Daftar Barang (${cart.length})</h4>
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
            <span>Total Tagihan:</span>
            <span style="font-family: monospace; color: #ffffff;">Rp ${subtotal.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    `;

    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Detail Rincian Pesanan',
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
      title: 'Memproses Pengiriman...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // 1. Generate Custom Resi Number: AO-[YEAR]-[ITEM_COUNT][PORT_ID][INSURANCE_INDICATOR]
      const shippingYear = formData.tanggal ? new Date(formData.tanggal).getFullYear() : new Date().getFullYear();
      const itemCount = cart.length;
      const originPortId = formData.asal;
      const insuranceIndicator = useInsurance ? '1' : '0';
      const resi = `AO-${shippingYear}-${itemCount}${originPortId}${insuranceIndicator}`;

      // 2. Insert shipment record
      const { data: shipment, error: errShipment } = await supabase
        .from('pengiriman')
        .insert([{
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

      // 3. Insert detail_pengiriman record
      const userId = currentUser?.id || 1; 
      const { error: errDetail } = await supabase
        .from('detail_pengiriman')
        .insert([{
          id_user: userId,
          id_pengiriman: shipment.id,
          subtotal: subtotal
        }]);

      if (errDetail) {
        throw new Error("Gagal menyimpan rincian pengiriman: " + errDetail.message);
      }

      // 4. Insert items into detail_barang and link first item to asuransi_barang if insurance checked
      let firstInsertedBarangId = null;

      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const { data: insertedBarang, error: errBarang } = await supabase
          .from('detail_barang')
          .insert([{
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

      // Save insurance details linked to the first item if shipment-level insurance checked
      if (useInsurance && firstInsertedBarangId) {
        const polisNum = 'POL-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
        const { error: errIns } = await supabase
          .from('asuransi_barang')
          .insert([{
            barang_id: firstInsertedBarangId,
            nomor_polis: polisNum,
            provider_asuransi: 'Anagata Proteksi Utama',
            nilai_pertanggungan: totalCargoCost * 10, // estimated cargo value
            premi_asuransi: totalInsuranceCost,
            status_asuransi: 'Aktif'
          }]);

        if (errIns) {
          console.error("Gagal mendaftarkan asuransi untuk pengiriman", errIns);
        }
      }

      // Success
      await Swal.fire({
        icon: 'success',
        title: 'Pengiriman Berhasil Dibuat!',
        html: `Nomor Resi Anda: <strong class="text-purple-400 font-mono">${resi}</strong><br/>Silakan pantau status pengiriman pada dashboard.`,
        confirmButtonColor: '#a855f7'
      });

      // Clear cart and reset recipient/route details (keep sender info)
      setCart([]);
      setUseInsurance(false);
      setFormData(prev => ({
        ...prev,
        namaPenerima: '', emailPenerima: '', teleponPenerima: '', alamatPenerima: '',
        asal: '', tujuan: '', tanggal: '', catatan: ''
      }));

    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        text: error.message || 'Gagal menyimpan pengiriman. Silakan coba kembali.'
      });
    }
  };

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-8 relative z-10 w-full space-y-6 flex-1">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Kirim Paket Baru</h2>
        <p className="text-gray-400 text-xs tracking-wider">Isi formulir di bawah untuk membuat request pengiriman barang melalui jalur laut</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Informasi Pengirim */}
        <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
            <UserCircleIcon className="w-4 h-4 text-[#b06aee]" /> Informasi Pengirim
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

        {/* Informasi Penerima */}
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

        {/* Detail Pengiriman */}
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
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Tanggal Pengiriman <span className="text-rose-500">*</span></label>
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

        {/* Input Sub-form Kargo */}
        <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
            <CubeIcon className="w-4 h-4 text-[#10b981]" /> Input Kargo / Barang
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Jenis Barang <span className="text-rose-500">*</span></label>
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
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Berat Barang (kg) <span className="text-rose-500">*</span></label>
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
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Deskripsi Kargo/Barang <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                value={itemForm.deskripsi}
                onChange={e => setItemForm({...itemForm, deskripsi: e.target.value})}
                placeholder="Misal: Lampu LED Philips, Lemari Kayu Jati" 
                className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 placeholder-gray-600 font-mono tracking-tight" 
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Catatan Tambahan untuk Barang</label>
              <input 
                type="text" 
                value={itemForm.catatanBarang}
                onChange={e => setItemForm({...itemForm, catatanBarang: e.target.value})}
                placeholder="Fragile, Simpan berdiri, dll" 
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

        {/* Tabel Keranjang Barang */}
        <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
              <CubeIcon className="w-4 h-4 text-[#a855f7]" /> Keranjang Kargo Anda (${cart.length} Barang)
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

          {/* Shipment-level Insurance Checkbox */}
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8 pb-10">
          <button 
            type="button" 
            onClick={() => {
              setCart([]);
              setUseInsurance(false);
              setFormData(prev => ({
                ...prev,
                namaPenerima: '', emailPenerima: '', teleponPenerima: '', alamatPenerima: '',
                asal: '', tujuan: '', tanggal: '', catatan: ''
              }));
            }}
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
    </main>
  );
}

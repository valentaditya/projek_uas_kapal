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

// cara connect db
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
  

  const [formData, setFormData] = useState({
    nama: '', email: '', telepon: '', alamatPengirim: '',
    namaPenerima: '', emailPenerima: '', teleponPenerima: '', alamatPenerima: '',
    asal: '', tujuan: '', tanggal: '', catatan: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({});

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
        const { data, error } = await // cara ambil data di db
 supabase.from('pelabuhan').select('id, nama_pelabuhan, kota')
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


  const handleAddItem = (e: React.MouseEvent) => {
    e.preventDefault();

    const newItemErrors: Record<string, string> = {};
    if (!itemForm.berat) {
      newItemErrors.berat = 'Berat barang wajib diisi';
    } else if (!/^\d+(\.\d+)?$/.test(itemForm.berat)) {
      newItemErrors.berat = 'Cuma bisa angka';
    } else if (parseFloat(itemForm.berat) <= 0) {
      newItemErrors.berat = 'Berat barang harus lebih besar dari 0!';
    }

    if (itemForm.volume && !/^\d+(\.\d+)?$/.test(itemForm.volume)) {
      newItemErrors.volume = 'Cuma bisa angka';
    } else if (itemForm.volume && parseFloat(itemForm.volume) < 0) {
      newItemErrors.volume = 'Volume barang tidak boleh negatif';
    }

    if (!itemForm.deskripsi.trim()) {
      newItemErrors.deskripsi = 'Deskripsi barang tidak boleh kosong!';
    }

    if (Object.keys(newItemErrors).length > 0) {
      setItemErrors(newItemErrors);
      const firstErrorField = Object.keys(newItemErrors)[0];
      const element = document.getElementById('itemForm_' + firstErrorField);
      if (element) {
        element.focus();
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setItemErrors({});

    const cargoTypeObj = CARGO_TYPES.find(c => c.value === itemForm.jenis) || CARGO_TYPES[4];
    const beratVal = parseFloat(itemForm.berat) || 0;
    const volumeVal = parseFloat(itemForm.volume) || 0;


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
        theme: 'dark',
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
    setItemErrors({});
  };


  const handleRemoveItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };


  const totalWeight = cart.reduce((sum, item) => sum + item.berat, 0);
  const totalVolume = cart.reduce((sum, item) => sum + item.volume, 0);
  const totalCargoCost = cart.reduce((sum, item) => sum + item.cargoCost, 0);
  const totalInsuranceCost = useInsurance ? Math.max(10000, Math.round(totalCargoCost * 0.005)) : 0;
  const subtotal = totalCargoCost + totalInsuranceCost;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.nama.trim()) newErrors.nama = 'Nama Pengirim wajib diisi';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.telepon.trim()) {
      newErrors.telepon = 'Nomor Telepon wajib diisi';
    } else if (!/^\+?[0-9]+$/.test(formData.telepon)) {
      newErrors.telepon = 'Hanya boleh berisi angka';
    } else {
      const digits = formData.telepon.trim().replace(/\+/g, '');
      if (digits.length < 8 || digits.length > 12) {
        newErrors.telepon = 'Nomor Telepon harus minimal 8 dan maksimal 12 digit';
      }
    }
    
    if (!formData.namaPenerima.trim()) newErrors.namaPenerima = 'Nama Penerima wajib diisi';
    if (formData.emailPenerima && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailPenerima)) {
      newErrors.emailPenerima = 'Format email tidak valid';
    }
    if (formData.teleponPenerima) {
      if (!/^\+?[0-9]+$/.test(formData.teleponPenerima)) {
        newErrors.teleponPenerima = 'Hanya boleh berisi angka';
      } else {
        const digits = formData.teleponPenerima.trim().replace(/\+/g, '');
        if (digits.length < 8 || digits.length > 12) {
          newErrors.teleponPenerima = 'Nomor Telepon harus minimal 8 dan maksimal 12 digit';
        }
      }
    }
    
    if (!formData.asal) newErrors.asal = 'Pelabuhan Asal wajib dipilih';
    if (!formData.tujuan) newErrors.tujuan = 'Pelabuhan Tujuan wajib dipilih';
    if (!formData.tanggal) newErrors.tanggal = 'Tanggal wajib diisi';

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

    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Keranjang Kosong',
        theme: 'dark',
        text: 'Silakan tambahkan minimal satu barang ke dalam keranjang sebelum mengirim!'
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
      cancelButtonText: 'Batal',
      theme: 'dark'
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: 'Memproses Pengiriman...',
      allowOutsideClick: false,
      theme: 'dark',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {

      const shippingYear = formData.tanggal ? new Date(formData.tanggal).getFullYear() : new Date().getFullYear();
      const itemCount = cart.length;
      const originPortId = formData.asal;
      const insuranceIndicator = useInsurance ? '1' : '0';
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const resi = `AO-${shippingYear}-${itemCount}${originPortId}${insuranceIndicator}${randomSuffix}`;


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

      // Insert notification for admin panel
      await supabase.from('notifikasi').insert([{
        title: 'Request Pengiriman Baru',
        message: `Request pengiriman ${resi} dari ${formData.nama} menunggu persetujuan.`,
        icon: 'CubeIcon',
        icon_color: 'text-cyan-500'
      }]);


      const userId = currentUser?.id || 1; 
      const { error: errDetail } = await // cara memasukkan data ke db
 supabase.from('detail_pengiriman').insert([{
          id_user: userId,
          id_pengiriman: shipment.id,
          subtotal: subtotal
        }]);

      if (errDetail) {
        throw new Error("Gagal menyimpan rincian pengiriman: " + errDetail.message);
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
        title: 'Pengiriman Berhasil Dibuat!',
        html: `Nomor Resi Anda: <strong class="text-purple-400 font-mono">${resi}</strong><br/>Silakan pantau status pengiriman pada dashboard.`,
        confirmButtonColor: '#a855f7',
        theme: 'dark'
      });


      setCart([]);
      setUseInsurance(false);
      setFormData(prev => ({
        ...prev,
        namaPenerima: '', emailPenerima: '', teleponPenerima: '', alamatPenerima: '',
        asal: '', tujuan: '', tanggal: '', catatan: ''
      }));
      setErrors({});
      setItemErrors({});

    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Terjadi Kesalahan',
        theme: 'dark',
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

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        
        
        <div className="bg-[#151922] border border-white/5 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6 text-gray-200 font-bold bg-white/5 inline-flex px-3 py-1.5 rounded text-xs tracking-wider border border-white/5">
            <UserCircleIcon className="w-4 h-4 text-[#b06aee]" /> Informasi Pengirim
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nama Pengirim <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                id="nama"
                value={formData.nama} 
                onChange={e => {
                  setFormData({...formData, nama: e.target.value});
                  if (errors.nama) setErrors({...errors, nama: ''});
                }}
                className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 placeholder-gray-600 font-mono tracking-tight ${
                  errors.nama 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                }`} 
              />
              {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Email <span className="text-rose-500">*</span></label>
              <input 
                type="email" 
                id="email"
                value={formData.email} 
                onChange={e => {
                  setFormData({...formData, email: e.target.value});
                  if (errors.email) setErrors({...errors, email: ''});
                }}
                className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 placeholder-gray-600 font-mono tracking-tight ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                }`} 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nomor Telepon <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                id="telepon"
                value={formData.telepon} 
                onChange={e => {
                  setFormData({...formData, telepon: e.target.value});
                  if (errors.telepon) setErrors({...errors, telepon: ''});
                }}
                placeholder="Contoh: 08123456789 (8-12 digit)"
                className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 placeholder-gray-600 font-mono tracking-tight ${
                  errors.telepon 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                }`} 
              />
              {errors.telepon && <p className="text-red-500 text-xs mt-1">{errors.telepon}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Alamat</label>
              <input 
                type="text" 
                value={formData.alamatPengirim} 
                onChange={e => setFormData({...formData, alamatPengirim: e.target.value})}
                placeholder="Contoh: Jl. Merdeka No. 123, Jakarta"
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
                id="namaPenerima"
                value={formData.namaPenerima}
                onChange={e => {
                  setFormData({...formData, namaPenerima: e.target.value});
                  if (errors.namaPenerima) setErrors({...errors, namaPenerima: ''});
                }}
                className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 placeholder-gray-600 font-mono tracking-tight ${
                  errors.namaPenerima 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                }`} 
              />
              {errors.namaPenerima && <p className="text-red-500 text-xs mt-1">{errors.namaPenerima}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Email</label>
              <input 
                type="email" 
                id="emailPenerima"
                value={formData.emailPenerima}
                onChange={e => {
                  setFormData({...formData, emailPenerima: e.target.value});
                  if (errors.emailPenerima) setErrors({...errors, emailPenerima: ''});
                }}
                className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 placeholder-gray-600 font-mono tracking-tight ${
                  errors.emailPenerima 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                }`} 
              />
              {errors.emailPenerima && <p className="text-red-500 text-xs mt-1">{errors.emailPenerima}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nomor Telepon</label>
              <input 
                type="text" 
                id="teleponPenerima"
                value={formData.teleponPenerima}
                onChange={e => {
                  setFormData({...formData, teleponPenerima: e.target.value});
                  if (errors.teleponPenerima) setErrors({...errors, teleponPenerima: ''});
                }}
                placeholder="Contoh: 08123456789 (8-12 digit)"
                className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 placeholder-gray-600 font-mono tracking-tight ${
                  errors.teleponPenerima 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                }`} 
              />
              {errors.teleponPenerima && <p className="text-red-500 text-xs mt-1">{errors.teleponPenerima}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Alamat</label>
              <input 
                type="text" 
                value={formData.alamatPenerima}
                onChange={e => setFormData({...formData, alamatPenerima: e.target.value})}
                placeholder="Contoh: Jl. Sudirman No. 45, Surabaya"
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
                  id="asal"
                  value={formData.asal}
                  onChange={e => {
                    setFormData({...formData, asal: e.target.value});
                    if (errors.asal) setErrors({...errors, asal: ''});
                  }}
                  className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 appearance-none cursor-pointer ${
                    errors.asal 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                  }`}
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
              {errors.asal && <p className="text-red-500 text-xs mt-1">{errors.asal}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Pelabuhan Tujuan <span className="text-rose-500">*</span></label>
              <div className="relative">
                <select 
                  id="tujuan"
                  value={formData.tujuan}
                  onChange={e => {
                    setFormData({...formData, tujuan: e.target.value});
                    if (errors.tujuan) setErrors({...errors, tujuan: ''});
                  }}
                  className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 appearance-none cursor-pointer ${
                    errors.tujuan 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                  }`}
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
              {errors.tujuan && <p className="text-red-500 text-xs mt-1">{errors.tujuan}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Tanggal Pengiriman <span className="text-rose-500">*</span></label>
              <input 
                type="date" 
                id="tanggal"
                value={formData.tanggal}
                onChange={e => {
                  setFormData({...formData, tanggal: e.target.value});
                  if (errors.tanggal) setErrors({...errors, tanggal: ''});
                }}
                className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-400 focus:outline-none focus:ring-1 font-mono tracking-tight ${
                  errors.tanggal 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                }`} 
              />
              {errors.tanggal && <p className="text-red-500 text-xs mt-1">{errors.tanggal}</p>}
            </div>
          </div>
        </div>

        
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
                type="text" 
                id="itemForm_berat"
                value={itemForm.berat}
                onChange={e => {
                  setItemForm({...itemForm, berat: e.target.value});
                  if (itemErrors.berat) setItemErrors({...itemErrors, berat: ''});
                }}
                placeholder="Berat dalam kg" 
                className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 font-mono tracking-tight ${
                  itemErrors.berat 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                }`} 
              />
              {itemErrors.berat && <p className="text-red-500 text-xs mt-1">{itemErrors.berat}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Volume Barang (m³)</label>
              <input 
                type="text" 
                id="itemForm_volume"
                value={itemForm.volume}
                onChange={e => {
                  setItemForm({...itemForm, volume: e.target.value});
                  if (itemErrors.volume) setItemErrors({...itemErrors, volume: ''});
                }}
                placeholder="Volume dalam m³" 
                className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 font-mono tracking-tight ${
                  itemErrors.volume 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                }`} 
              />
              {itemErrors.volume && <p className="text-red-500 text-xs mt-1">{itemErrors.volume}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Deskripsi Kargo/Barang <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                id="itemForm_deskripsi"
                value={itemForm.deskripsi}
                onChange={e => {
                  setItemForm({...itemForm, deskripsi: e.target.value});
                  if (itemErrors.deskripsi) setItemErrors({...itemErrors, deskripsi: ''});
                }}
                placeholder="Misal: Lampu LED Philips, Lemari Kayu Jati" 
                className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 font-mono tracking-tight ${
                  itemErrors.deskripsi 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                }`} 
              />
              {itemErrors.deskripsi && <p className="text-red-500 text-xs mt-1">{itemErrors.deskripsi}</p>}
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

          <div className="border border-white/5 rounded-md overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs min-w-[600px]">
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
            onClick={() => {
              setCart([]);
              setUseInsurance(false);
              setFormData(prev => ({
                ...prev,
                namaPenerima: '', emailPenerima: '', teleponPenerima: '', alamatPenerima: '',
                asal: '', tujuan: '', tanggal: '', catatan: ''
              }));
              setErrors({});
              setItemErrors({});
            }}
            className="px-6 py-2 rounded-md bg-[#6b21a8]/25 text-purple-300 border border-[#b06aee]/20 hover:bg-[#6b21a8]/40 transition-colors font-bold text-xs tracking-wider shadow"
          >
            Reset Form
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 rounded-md bg-[#a855f7] hover:bg-[#9333ea] text-white transition-colors font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2"
          >
            <PaperAirplaneIcon className="w-4 h-4" /> Kirim Permintaan
          </button>
        </div>

      </form>
    </main>
  );
}

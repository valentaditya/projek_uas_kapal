"use client";

import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { createClient } from '@/utils/supabase/client';
import { generatePagination } from '@/app/lib/utils';
import Swal from 'sweetalert2';

export default function KelolaUserPage() {
  // cara connect db
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    username: '', name: '', email: '', phone: '', role: '', status: '', company: '', location: '', password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      const { data, error } = await // cara ambil data user di db
 supabase.from('user').select('*').order('id', { ascending: false });
      if (data && !error) {
        setUsers(data);
      } else if (error) {
        console.error("Error fetching users:", error);
      }
    } catch (e) {
      console.error("Failed to fetch users:", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [supabase]);

  const filteredUsers = users.filter(user => 
    (user.nama_lengkap || '').toLowerCase().includes(search.toLowerCase()) || 
    (user.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (user.username || '').toLowerCase().includes(search.toLowerCase())
  );

  // Reset page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Adjust page index if data length shrinks
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredUsers.length, itemsPerPage, totalPages, currentPage]);

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      name: user.nama_lengkap || '',
      email: user.email || '',
      phone: user.no_telepon || '',
      role: user.role || '',
      status: user.status || '',
      company: user.perusahaan || '',
      location: user.alamat || '',
      password: user.password || ''
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) newErrors.username = 'Username wajib diisi';
    if (!editingUser && !formData.password.trim()) newErrors.password = 'Password wajib diisi';
    if (!formData.name.trim()) newErrors.name = 'Nama Lengkap wajib diisi';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'No. Telepon wajib diisi';
    } else if (!/^\+?[0-9]+$/.test(formData.phone)) {
      newErrors.phone = 'Hanya boleh berisi angka';
    } else {
      const digits = formData.phone.trim().replace(/\+/g, '');
      if (digits.length < 8 || digits.length > 12) {
        newErrors.phone = 'No. Telepon harus minimal 8 dan maksimal 12 digit';
      }
    }
    
    if (!formData.role) newErrors.role = 'Role wajib dipilih';
    if (!formData.status) newErrors.status = 'Status wajib dipilih';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.focus();
      }
      return;
    }
    

    const payload: any = {
      username: formData.username,
      nama_lengkap: formData.name,
      email: formData.email,
      no_telepon: formData.phone,
      role: formData.role,
      status: formData.status,
      perusahaan: formData.company,
      alamat: formData.location
    };

    if (editingUser) {

      if (formData.password) {
        payload.password = formData.password;
      }
      const { error } = await // cara perbarui data di db
 supabase.from('user').update(payload).eq('id', editingUser.id);
      if (!error) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data user berhasil diperbarui.',
          background: '#151922',
          color: '#ffffff',
          showConfirmButton: false,
          timer: 1500
        });
        fetchUsers();
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ username: '', name: '', email: '', phone: '', role: '', status: '', company: '', location: '', password: '' });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: "Gagal memperbarui user: " + error.message,
          background: '#151922',
          color: '#ffffff',
          confirmButtonColor: '#a855f7'
        });
      }
    } else {

      payload.password = formData.password || formData.username;
      const { error } = await // cara memasukkan data ke db
 supabase.from('user').insert([payload]);
      if (!error) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'User baru berhasil ditambahkan.',
          background: '#151922',
          color: '#ffffff',
          showConfirmButton: false,
          timer: 1500
        });
        fetchUsers();
        setIsModalOpen(false);
        setFormData({ username: '', name: '', email: '', phone: '', role: '', status: '', company: '', location: '', password: '' });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: "Gagal menambahkan user: " + error.message,
          background: '#151922',
          color: '#ffffff',
          confirmButtonColor: '#a855f7'
        });
      }
    }
  };

  const deleteUser = async (id: number) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Apakah Anda yakin ingin menghapus user ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      background: '#151922',
      color: '#ffffff'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Menghapus User...',
        allowOutsideClick: false,
        background: '#151922',
        color: '#ffffff',
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const { error } = await // cara hapus data di db
 supabase.from('user').delete().eq('id', id);

      if (!error) {
        Swal.fire({
          icon: 'success',
          title: 'Dihapus!',
          text: 'Data user berhasil dihapus.',
          background: '#151922',
          color: '#ffffff',
          showConfirmButton: false,
          timer: 1500
        });
        fetchUsers();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: "Gagal menghapus user: " + error.message,
          background: '#151922',
          color: '#ffffff',
          confirmButtonColor: '#a855f7'
        });
      }
    }
  };

  return (
    <main className="mx-auto px-6 py-10 relative z-10 w-full max-w-[1500px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wider text-white mb-2">Kelola Pengguna</h2>
          <p className="text-gray-400 text-xs tracking-wider">Manajemen akun pengguna sistem</p>
        </div>
        
        <button 
          onClick={() => {
            setEditingUser(null);
            setFormData({ username: '', name: '', email: '', phone: '', role: '', status: '', company: '', location: '', password: '' });
            setErrors({});
            setIsModalOpen(true);
          }}
          className="bg-[#b06aee] hover:bg-[#9a54d6] text-white px-4 py-2 rounded-md shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all font-bold text-xs tracking-wider flex items-center gap-2"
        >
          + Tambah User
        </button>
      </div>

      <div className="mb-6 relative w-full">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          type="text"
          placeholder="Cari nama, email, atau username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#151922] border border-white/5 rounded-md pl-12 pr-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50 transition-all placeholder:text-gray-600"
        />
      </div>

      <div className="bg-[#151922] border border-white/5 rounded-[10px] overflow-hidden mb-20 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#8b5cf6] text-white text-[11px] tracking-wider uppercase font-bold">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Kontak</th>
                <th className="px-6 py-4 font-bold">Perusahaan</th>
                <th className="px-6 py-4 font-bold">Role</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[11px]">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse shrink-0" />
                        <div className="space-y-2">
                          <div className="w-28 h-3.5 bg-white/5 animate-pulse rounded" />
                          <div className="w-16 h-3 bg-white/5 animate-pulse rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="w-32 h-3.5 bg-white/5 animate-pulse rounded" />
                        <div className="w-20 h-3 bg-white/5 animate-pulse rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="w-24 h-3.5 bg-white/5 animate-pulse rounded" />
                        <div className="w-28 h-3 bg-white/5 animate-pulse rounded" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-16 h-4 bg-white/5 animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-4 bg-white/5 animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <div className="w-7 h-7 bg-white/5 animate-pulse rounded" />
                        <div className="w-7 h-7 bg-white/5 animate-pulse rounded" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 font-mono">
                    Tidak ada pengguna ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#b06aee]/10 border border-[#b06aee]/20 flex items-center justify-center shrink-0">
                          <UserCircleIcon className="w-6 h-6 text-[#b06aee]" />
                        </div>
                        <div>
                          <p className="text-gray-200 font-bold tracking-wide text-xs">{user.nama_lengkap}</p>
                          <p className="text-gray-500 font-mono mt-0.5">{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-300 font-mono tracking-tight mb-0.5">{user.email}</p>
                      <p className="text-gray-500 font-mono">{user.no_telepon}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-gray-300 font-bold tracking-wide mb-0.5">{user.perusahaan || '-'}</p>
                      <p className="text-gray-500">{user.alamat || '-'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'Admin' ? (
                        <div className="flex items-center gap-1.5 text-[#b06aee]">
                          <ShieldCheckIcon className="w-4 h-4" />
                          <span className="font-bold tracking-wide">Admin</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[#3b82f6]">
                          <UserIcon className="w-4 h-4" />
                          <span className="font-bold tracking-wide">User</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold tracking-widest uppercase ${
                        user.status === 'Aktif' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-gray-500/10 text-gray-500'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(user)} className="p-1.5 text-gray-400 hover:text-[#b06aee] transition-colors rounded hover:bg-[#b06aee]/10">
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteUser(user.id)} className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors rounded hover:bg-rose-500/10">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loading && filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-white/5 bg-[#11141b]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 font-mono">
            <div className="flex flex-wrap items-center gap-4 text-[10px]">
              <span>
                Menampilkan <span className="text-[#b06aee] font-bold">{Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)}</span> - <span className="text-[#b06aee] font-bold">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> dari <span className="text-white font-bold">{filteredUsers.length}</span> user
              </span>
              <div className="flex items-center gap-2 border-l border-white/5 pl-4">
                <span>Tampilkan:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-[#151922] border border-white/10 rounded px-2 py-0.5 text-[10px] text-gray-200 focus:outline-none focus:border-[#b06aee]/50 cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded bg-[#1b202c] border border-white/5 text-gray-300 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-[#1b202c] disabled:hover:text-gray-300 transition-colors text-[10px] font-medium"
              >
                Sebelumnya
              </button>
              
              {/* Page Numbers */}
              {generatePagination(currentPage, totalPages).map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-1 text-gray-600 text-[10px]">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={`page-${page}`}
                    onClick={() => setCurrentPage(Number(page))}
                    className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#b06aee] text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                        : 'bg-[#1b202c] border border-white/5 text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded bg-[#1b202c] border border-white/5 text-gray-300 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-[#1b202c] disabled:hover:text-gray-300 transition-colors text-[10px] font-medium"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#151922] border border-white/5 rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-xl font-bold tracking-wider text-white">
                {editingUser ? 'Edit User' : 'Tambah User Baru'}
              </h3>
            </div>
            
            <form onSubmit={handleAddSubmit} noValidate className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Username *</label>
                  <input 
                    type="text" 
                    id="username"
                    value={formData.username} 
                    onChange={e => {
                      const newUsername = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        username: newUsername,
                        password: (!editingUser && (prev.password === prev.username || prev.password === '')) ? newUsername : prev.password
                      }));
                      if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                    }}
                    className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 ${
                      errors.username 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                    }`}
                  />
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono font-sans">
                    {editingUser ? 'Password (Kosongkan jika tidak diubah)' : 'Password (Default: username) *'}
                  </label>
                  <input 
                    type="text" 
                    id="password"
                    value={formData.password} 
                    onChange={e => {
                      setFormData({...formData, password: e.target.value});
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    placeholder={editingUser ? '••••••••' : 'Masukkan password'}
                    className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                    }`}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Nama Lengkap *</label>
                  <input 
                    type="text" 
                    id="name"
                    value={formData.name} onChange={e => {
                      setFormData({...formData, name: e.target.value});
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
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
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Email *</label>
                  <input 
                    type="email" 
                    id="email"
                    value={formData.email} onChange={e => {
                      setFormData({...formData, email: e.target.value});
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">No. Telepon *</label>
                  <input 
                    type="text" 
                    id="phone"
                    value={formData.phone} onChange={e => {
                      setFormData({...formData, phone: e.target.value});
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    placeholder="Contoh: 08123456789 (8-12 digit)"
                    className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 ${
                      errors.phone 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Role *</label>
                  <div className="relative">
                    <select 
                      id="role"
                      value={formData.role} 
                      onChange={e => {
                        setFormData({...formData, role: e.target.value});
                        if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
                      }}
                      className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 appearance-none bg-none cursor-pointer ${
                        errors.role 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                      }`}
                    >
                      <option value="" disabled>Pilih Role</option>
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Status *</label>
                  <div className="relative">
                    <select 
                      id="status"
                      value={formData.status} 
                      onChange={e => {
                        setFormData({...formData, status: e.target.value});
                        if (errors.status) setErrors(prev => ({ ...prev, status: '' }));
                      }}
                      className={`w-full bg-[#1b202c] border rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:ring-1 appearance-none bg-none cursor-pointer ${
                        errors.status 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-white/5 focus:border-[#b06aee]/50 focus:ring-[#b06aee]/50'
                      }`}
                    >
                      <option value="" disabled>Pilih Status</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Perusahaan</label>
                  <input 
                    type="text" 
                    value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-[#1b202c] border border-white/5 rounded-md px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-[#b06aee]/50 focus:ring-1 focus:ring-[#b06aee]/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-300 mb-2 font-mono">Alamat</label>
                  <input 
                    type="text" 
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="Contoh: Jl. Merdeka No. 123, Jakarta"
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
                  {editingUser ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

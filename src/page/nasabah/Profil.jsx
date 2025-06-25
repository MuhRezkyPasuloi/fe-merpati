import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaPhone, FaMapMarkerAlt, FaCamera, FaWallet } from 'react-icons/fa';

const Profil = () => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
  try {
    const profile = JSON.parse(Cookies.get('profile')); // ambil dari cookies
    const token = Cookies.get('token');
    const id = profile.id;

    const res = await axios.get(`http://localhost:3000/api/nasabah/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(res.data);
  } catch (err) {
    console.error('Gagal memuat profil:', err);
  }
};

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return <div className="p-6">Memuat data profil...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Selamat Datang, {user.nama.split(' ')[0]}!</h1>
        <p className="text-sm text-gray-500">Pantau aktivitas bank sampah Anda</p>
      </div>

      <h2 className="text-lg font-bold text-gray-800">Profil Saya</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kartu Profil */}
        <div className="bg-white border rounded-lg p-6 flex flex-col items-center text-center">
          <div className="relative">
            {user.foto_url ? (
              <img
                src={user.foto_url}
                alt="Foto Profil"
                className="w-48 h-48 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-5xl text-emerald-700">
                <span>👤</span>
              </div>
            )}
            <button className="absolute bottom-0 right-0 bg-emerald-400 hover:bg-emerald-500 p-1 rounded-full text-white">
              <FaCamera className="text-xs" />
            </button>
          </div>
          
        </div>

        {/* Informasi Pribadi */}
        <div className="md:col-span-2 bg-white border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input
                type="text"
                className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                value={user.nama}
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Saldo</label>
              <div className="flex items-center mt-1 border rounded-md px-3 py-2">
                <FaWallet className="text-gray-400 mr-2" />
                <input
                  type="text"
                  className="w-full outline-none text-sm"
                  value={`Rp ${user.saldo.toLocaleString('id-ID')}`}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">No. Handphone</label>
              <div className="flex items-center mt-1 border rounded-md px-3 py-2">
                <FaPhone className="text-gray-400 mr-2" />
                <input
                  type="text"
                  className="w-full outline-none text-sm"
                  value={user.no_hp}
                  readOnly
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Alamat</label>
              <div className="flex items-center mt-1 border rounded-md px-3 py-2">
                <FaMapMarkerAlt className="text-gray-400 mr-2" />
                <input
                  type="text"
                  className="w-full outline-none text-sm"
                  value={user.alamat}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-right mt-4">
            Terakhir diperbarui: <span className="font-medium">
              {new Date(user.updatedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="border border-gray-300 text-sm px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50">
          Edit Profil
        </button>
      </div>
    </div>
  );
};

export default Profil;

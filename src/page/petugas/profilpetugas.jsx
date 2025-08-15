import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaSignOutAlt,
  FaUser,
  FaBriefcase
} from 'react-icons/fa';

const ProfilPetugas = () => {
  const [user, setUser] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [editLogin, setEditLogin] = useState(false);
  const [form, setForm] = useState({});
  const [loginForm, setLoginForm] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const profile = JSON.parse(Cookies.get('profile'));
      const token = Cookies.get('token');
      const id = profile.id;

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/petugas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setForm({
        nama: res.data.nama,
        posisi: res.data.posisi,
        no_hp: res.data.no_hp,
        alamat: res.data.alamat,
        foto_url: res.data.foto_url,
      });
      setLoginForm({
        username: res.data.login.username || '',
        email: res.data.login.email || '',
        password: '',
      });
    } catch (err) {
      console.error('Gagal memuat profil:', err);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    Cookies.remove('username');
    Cookies.remove('profile');
    navigate('/');
  };

  const handleProfileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const handleProfileSubmit = async () => {
    try {
      const token = Cookies.get('token');
      const formData = new FormData();
      formData.append('nama', form.nama);
      formData.append('posisi', form.posisi);
      formData.append('no_hp', form.no_hp);
      formData.append('alamat', form.alamat);
      if (selectedImage) {
        formData.append('foto', selectedImage);
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/petugas/${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setEditProfile(false);
      setSelectedImage(null);
      fetchUser();
    } catch (err) {
      console.error('Gagal memperbarui profil:', err);
    }
  };

  const handleLoginSubmit = async () => {
    try {
      const token = Cookies.get('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/login/${user.id_login}`,
        loginForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditLogin(false);
      alert('Data Login berhasil diubah');
    } catch (err) {
      console.error('Gagal memperbarui akun login:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) return <div className="p-6">Memuat data profil...</div>;

  return (
    <div className="space-y-6 p-6 pb-24">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Selamat Datang, {user.nama.split(' ')[0]}!</h1>
        <p className="text-sm text-gray-500">Pantau aktivitas bank sampah Anda</p>
      </div>

      <h2 className="text-lg font-bold text-gray-800">Profil Petugas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Foto Profil */}
        <div className="bg-white border rounded-lg p-6 flex flex-col items-center text-center">
          <div className="relative">
            {user.foto_url ? (
              <img src={user.foto_url} alt="Foto Profil" className="w-48 h-48 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-5xl text-emerald-700">
                <span>👤</span>
              </div>
            )}
            {editProfile && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute bottom-0 right-0 opacity-0 w-full h-full cursor-pointer"
                />
                <button className="absolute bottom-0 right-0 bg-emerald-400 hover:bg-emerald-500 p-1 rounded-full text-white">
                  <FaCamera className="text-xs" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info Pribadi */}
        <div className="md:col-span-2 bg-white border rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input type="text" name="nama" value={form.nama || ''} onChange={handleProfileChange}
                readOnly={!editProfile} className="mt-1 w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Posisi</label>
              <div className="flex items-center mt-1 border rounded-md px-3 py-2">
                <FaBriefcase className="text-gray-400 mr-2" />
                <input type="text" name="posisi" value={form.posisi || ''} onChange={handleProfileChange}
                  readOnly={!editProfile} className="w-full outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">No. Handphone</label>
              <div className="flex items-center mt-1 border rounded-md px-3 py-2">
                <FaPhone className="text-gray-400 mr-2" />
                <input type="text" name="no_hp" value={form.no_hp || ''} onChange={handleProfileChange}
                  readOnly={!editProfile} className="w-full outline-none text-sm" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Alamat</label>
              <div className="flex items-center mt-1 border rounded-md px-3 py-2">
                <FaMapMarkerAlt className="text-gray-400 mr-2" />
                <input type="text" name="alamat" value={form.alamat || ''} onChange={handleProfileChange}
                  readOnly={!editProfile} className="w-full outline-none text-sm" />
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-right mt-4">
            Terakhir diperbarui:{' '}
            <span className="font-medium">
              {new Date(user.updatedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setEditProfile(!editProfile)}
          className="border border-gray-300 text-sm px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
        >
          {editProfile ? 'Batal' : 'Edit Profil'}
        </button>
        {editProfile && (
          <button
            onClick={handleProfileSubmit}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-2 rounded-md"
          >
            Simpan
          </button>
        )}
        <button
          onClick={() => setEditLogin(!editLogin)}
          className="border border-blue-500 text-blue-500 text-sm px-4 py-2 rounded-md hover:bg-blue-50"
        >
          {editLogin ? 'Batal' : 'Edit Akun Login'}
        </button>
        <button
          onClick={handleLogout}
          className="block md:hidden border border-red-500 text-red-500 text-sm px-4 py-2 rounded-md hover:bg-red-50"
        >
          <FaSignOutAlt className="inline mr-1" /> Logout
        </button>
      </div>

      {/* Form Edit Login */}
      {editLogin && (
        <div className="bg-white border rounded-lg p-6 mt-6 space-y-4 max-w-md">
          <h3 className="text-md font-bold text-gray-800 mb-4 flex items-center">
            <FaUser className="mr-2" /> Edit Akun Login
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={loginForm.username}
              onChange={handleLoginChange}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password Baru</label>
            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={handleLoginSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
          >
            Simpan Perubahan
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilPetugas;

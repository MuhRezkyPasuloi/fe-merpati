import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaFile } from 'react-icons/fa';

const API_URL = 'http://localhost:3000/api/petugas';

const ManajemenPetugas = () => {
  const [petugas, setPetugas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewPopup, setPreviewPopup] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    nama: '',
    posisi: '',
    no_hp: '',
    alamat: '',
    foto: null,
  });

  const fetchData = async () => {
    const res = await axios.get(API_URL);
    setPetugas(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (data = null) => {
    setModalOpen(true);
    if (data) {
      setFormData({ ...data, foto: null }); // Foto tidak dimasukkan saat edit
    } else {
      setFormData({
        id: null,
        username: '',
        nama: '',
        posisi: '',
        no_hp: '',
        alamat: '',
        foto: null,
      });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setPreviewImage(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      setFormData({ ...formData, foto: files[0] });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('username', formData.username);
    form.append('nama', formData.nama);
    form.append('posisi', formData.posisi);
    form.append('no_hp', formData.no_hp);
    form.append('alamat', formData.alamat);
    if (formData.foto) {
      form.append('foto', formData.foto);
    }

    if (formData.id) {
      // Edit
      await axios.put(`${API_URL}/${formData.id}`, form);
    } else {
      // Tambah
      await axios.post(API_URL, form);
    }

    closeModal();
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus petugas ini?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchData();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p className="text-sm text-gray-500">Kelola sistem bank sampah HijauCycle</p>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manajemen Petugas</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded">
          <FaPlus /> Tambah Petugas
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-6 py-3">Nama</th>
              
              <th className="px-6 py-3">Posisi</th>
              <th className="px-6 py-3">No HP</th>
              <th className="px-6 py-3">Alamat</th>
              <th className="px-6 py-3">Foto</th>
              <th className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {petugas.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="px-6 py-4">{row.nama}</td>
                
                <td className="px-6 py-4">{row.posisi}</td>
                <td className="px-6 py-4">{row.no_hp}</td>
                <td className="px-6 py-4">{row.alamat}</td>
                <td className="px-6 py-4">
                  <button onClick={() => setPreviewPopup(row.foto_url)} className="text-blue-500 hover:underline">
                    <FaFile />
                  </button>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => openModal(row)} className="text-blue-600 hover:text-blue-800 border p-2 rounded">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-800 border p-2 rounded">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-[90%] max-w-lg">
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit' : 'Tambah'} Petugas</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="username" value={formData.username} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Username" />
              <input name="nama" value={formData.nama} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Nama" required />
              <input name="posisi" value={formData.posisi} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Posisi" required />
              <input name="no_hp" value={formData.no_hp} onChange={handleChange} className="w-full p-2 border rounded" placeholder="No HP" required />
              <input name="alamat" value={formData.alamat} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Alamat" required />
              <input type="file" name="foto" accept="image/*" onChange={handleChange} className="w-full" />
              {previewImage && <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover mt-2" />}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Batal</button>
                <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Foto Preview */}
      {previewPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow">
            <img src={previewPopup} alt="Foto Petugas" className="max-w-md max-h-[80vh]" />
            <div className="text-right mt-4">
              <button onClick={() => setPreviewPopup(null)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenPetugas;

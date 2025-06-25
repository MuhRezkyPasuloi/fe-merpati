import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaFileImage } from 'react-icons/fa';

const API_URL = 'http://localhost:3000/api/sampah';

const ManajemenSampah = () => {
  const [sampah, setSampah] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewPopup, setPreviewPopup] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    jenis_sampah: '',
    harga: '',
    stok: '',
    foto: null,
  });

  const fetchData = async () => {
    const res = await axios.get(API_URL);
    setSampah(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (data = null) => {
    setModalOpen(true);
    if (data) {
      setFormData({ ...data, foto: null });
    } else {
      setFormData({
        id: null,
        jenis_sampah: '',
        harga: '',
        stok: '',
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
    form.append('jenis_sampah', formData.jenis_sampah);
    form.append('harga', formData.harga);
    form.append('stok', formData.stok);
    if (formData.foto) {
      form.append('foto', formData.foto);
    }

    if (formData.id) {
      await axios.put(`${API_URL}/${formData.id}`, form);
    } else {
      await axios.post(API_URL, form);
    }

    closeModal();
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
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
        <h2 className="text-xl font-semibold">Manajemen Sampah</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded">
          <FaPlus /> Tambah Jenis Sampah
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-6 py-3">Jenis Sampah</th>
              <th className="px-6 py-3">Stok (kg)</th>
              <th className="px-6 py-3">Harga per Kg</th>
              <th className="px-6 py-3">Foto</th>
              <th className="px-6 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sampah.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-6 py-4">{item.jenis_sampah}</td>
                <td className="px-6 py-4">{item.stok} kg</td>
                <td className="px-6 py-4">Rp {item.harga.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => setPreviewPopup(item.foto_url)} className="text-blue-500 hover:underline">
                    <FaFileImage />
                  </button>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800 border p-2 rounded">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 border p-2 rounded">
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
            <h2 className="text-xl font-bold mb-4">{formData.id ? 'Edit' : 'Tambah'} Jenis Sampah</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="jenis_sampah" value={formData.jenis_sampah} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Jenis Sampah" required />
              <input type="number" name="stok" value={formData.stok} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Stok (kg)" required />
              <input type="number" name="harga" value={formData.harga} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Harga per Kg" required />
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
            <img src={previewPopup} alt="Foto Sampah" className="max-w-md max-h-[80vh]" />
            <div className="text-right mt-4">
              <button onClick={() => setPreviewPopup(null)} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenSampah;

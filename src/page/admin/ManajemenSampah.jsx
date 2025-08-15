import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaFile, FaEdit, FaTrash } from 'react-icons/fa';
import Pagination from '../../components/Pagination';

const Sampah = () => {
  const [sampahList, setSampahList] = useState([]);
  const [jenisSampah, setJenisSampah] = useState('');
  const [foto, setFoto] = useState(null);
  const [hargaVendor, setHargaVendor] = useState('');
  const [harga, setHarga] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const token = Cookies.get('token');
  const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(sampahList.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = sampahList.slice(startIndex, startIndex + itemsPerPage);

  const fetchSampah = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sampah`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSampahList(res.data);
    } catch (err) {
      console.error('Gagal mengambil data sampah', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('jenis_sampah', jenisSampah);
    formData.append('harga_vendor', hargaVendor);
    formData.append('harga', harga);
    if (foto) formData.append('foto', foto);

    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/sampah/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/sampah`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setJenisSampah('');
      setFoto(null);
      setHargaVendor('');
      setHarga('');
      setEditingId(null);
      setModalOpen(false);
      fetchSampah();
    } catch (err) {
      console.error('Gagal menyimpan data sampah', err);
    }
  };

  const handleEdit = (item) => {
    setJenisSampah(item.jenis_sampah);
    setHargaVendor(item.harga_vendor);
    setHarga(item.harga);
    setEditingId(item.id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/sampah/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSampah();
    } catch (err) {
      console.error('Gagal menghapus data sampah', err);
    }
  };

  useEffect(() => {
    fetchSampah();
  }, []);

  useEffect(() => {
    if (hargaVendor) {
      const calculated = parseInt(hargaVendor * 0.8);
      setHarga(isNaN(calculated) ? '' : calculated);
    }
  }, [hargaVendor]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manajemen Data Sampah</h2>

      <button
        onClick={() => {
          setEditingId(null);
          setJenisSampah('');
          setFoto(null);
          setHargaVendor('');
          setHarga('');
          setModalOpen(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        + Tambah Sampah
      </button>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-3 text-xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit' : 'Tambah'} Sampah</h3>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="block mb-1 font-medium">Jenis Sampah</label>
                <input
                  type="text"
                  value={jenisSampah}
                  onChange={(e) => setJenisSampah(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Foto Sampah</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFoto(e.target.files[0])}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Harga Vendor</label>
                <input
                  type="number"
                  value={hargaVendor}
                  onChange={(e) => setHargaVendor(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Harga (80%)</label>
                <input
                  type="number"
                  value={harga}
                  readOnly
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                />
              </div>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
                Simpan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TABEL */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-green-700 text-white">
            <th className="border p-2">No</th>
            <th className="border p-2">Jenis Sampah</th>
            <th className="border p-2">Harga Vendor</th>
            <th className="border p-2">Harga</th>
            <th className="border p-2">Foto</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={item.id}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{item.jenis_sampah}</td>
              <td className="border p-2 text-center">Rp {item.harga_vendor || 0}</td>
              <td className="border p-2 text-center">Rp {item.harga}</td>
              <td className="border p-2 text-center">
                {item.foto_url ? (
                  <button
                    onClick={() => setPreviewImage(item.foto_url)}
                    className="text-blue-500 underline"
                  >
                    <FaFile />
                  </button>
                ) : (
                  '-'
                )}
              </td>
              <td className="border p-2 text-center">
                <button onClick={() => handleEdit(item)} className="text-blue-600 mr-2"><FaEdit /></button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setPreviewImage('')}
              className="absolute top-0 right-0 text-white text-xl font-bold"
            >
              &times;
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[80vh] rounded" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sampah;

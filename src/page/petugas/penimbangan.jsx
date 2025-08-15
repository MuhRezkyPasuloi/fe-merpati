import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Pagination from '../../components/Pagination';

const Penimbangan = () => {
  const [tabunganList, setTabunganList] = useState([]);
  const [nasabahList, setNasabahList] = useState([]);
  const [sampahList, setSampahList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTabungan, setSelectedTabungan] = useState(null);
  const [formData, setFormData] = useState({ id_nasabah: '', jenis_sampah: '', berat: '' });

  const itemsPerPage = 10;
      const [currentPage, setCurrentPage] = useState(1);
      const totalPages = Math.ceil(tabunganList.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const currentData = tabunganList.slice(startIndex, startIndex + itemsPerPage);

  const getAuthConfig = () => {
    const token = Cookies.get('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchAllData = async () => {
    try {
      const [tabRes, nasRes, sampRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/tabungan`, getAuthConfig()),
        axios.get(`${import.meta.env.VITE_API_URL}/api/nasabah`, getAuthConfig()),
        axios.get(`${import.meta.env.VITE_API_URL}/api/sampah`, getAuthConfig())
      ]);
      const sortedTabungan = tabRes.data.data.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

    setTabunganList(sortedTabungan);
      setNasabahList(nasRes.data);
      setSampahList(sampRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const openModal = (t = null) => {
    setSelectedTabungan(t);
    setFormData(t ? {
      id_nasabah: t.id_nasabah,
      jenis_sampah: t.jenis_sampah,
      berat: t.berat
    } : { id_nasabah: '', jenis_sampah: '', berat: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTabungan(null);
  };

  const handleInputChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (selectedTabungan) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/tabungan/${selectedTabungan.id}`, {
          jenis_sampah: formData.jenis_sampah,
          berat: Number(formData.berat)
        }, getAuthConfig());
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/tabungan`, {
          id_nasabah: formData.id_nasabah,
          jenis_sampah: formData.jenis_sampah,
          berat: Number(formData.berat)
        }, getAuthConfig());
      }
      fetchAllData();
      closeModal();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async id => {
    if (confirm('Yakin ingin menghapus?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/tabungan/${id}`, getAuthConfig());
        fetchAllData();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const getNamaNasabah = id => {
    const n = nasabahList.find(n => n.id === id);
    return n?.nama || '-';
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold">Dashboard Petugas</h2>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold mt-4">Penimbangan Sampah</h3>
        <button onClick={() => openModal()} className="flex bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          <FaPlus className='my-1 mr-2'/> Input Penimbangan
        </button>
      </div>

      <div className="bg-white shadow rounded">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">Nasabah</th>
              <th className="p-3">Jenis Sampah</th>
              <th className="p-3">Harga/kg</th>
              <th className="p-3">Berat</th>
              <th className="p-3">Total</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((t, index) => (
              <tr key={t.id} className="border-t">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{getNamaNasabah(t.id_nasabah)}</td>
                <td className="p-3">{t.jenis_sampah}</td>
                <td className="p-3">Rp {t.harga.toLocaleString()}</td>
                <td className="p-3">{t.berat} kg</td>
                <td className="p-3">Rp {t.total.toLocaleString()}</td>
                <td className="p-3">{new Date(t.created_at).toLocaleDateString()}</td>
                <td className="p-3">{t.sudah_dijual ? 'Sudah Dijual' : 'Belum Dijual'}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => openModal(t)}
                      disabled={t.sudah_dijual}
                      className={`p-2 border rounded text-xs ${
                        t.sudah_dijual
                          ? 'text-gray-400 border-gray-300'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={t.sudah_dijual}
                      className={`p-2 border rounded text-xs ${
                        t.sudah_dijual
                          ? 'text-gray-400 border-gray-300'
                          : 'text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">{selectedTabungan ? 'Edit' : 'Input'} Penimbangan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!selectedTabungan && (
                <select name="id_nasabah" value={formData.id_nasabah} onChange={handleInputChange} className="w-full border p-2 rounded" required>
                  <option value="">Pilih Nasabah</option>
                  {nasabahList.map(n => <option key={n.id} value={n.id}>{n.nama}</option>)}
                </select>
              )}
              <select name="jenis_sampah" value={formData.jenis_sampah} onChange={handleInputChange} className="w-full border p-2 rounded" required>
                <option value="">Pilih Jenis Sampah</option>
                {sampahList.map(s => <option key={s.id} value={s.jenis_sampah}>{s.jenis_sampah}</option>)}
              </select>
              <input type="number" name="berat" placeholder="Berat (kg)" value={formData.berat} onChange={handleInputChange} className="w-full border p-2 rounded" required />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded hover:bg-gray-100">Batal</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Penimbangan;

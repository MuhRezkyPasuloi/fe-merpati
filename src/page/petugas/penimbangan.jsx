import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Penimbangan = () => {
  const [tabunganList, setTabunganList] = useState([]);
  const [nasabahList, setNasabahList] = useState([]);
  const [sampahList, setSampahList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTabungan, setSelectedTabungan] = useState(null);
  const [formData, setFormData] = useState({
    id_nasabah: '',
    jenis_sampah: '',
    berat: ''
  });

  const getAuthConfig = () => {
    const token = Cookies.get('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    };
  };

  const fetchAllData = async () => {
    try {
      const [tabunganRes, nasabahRes, sampahRes] = await Promise.all([
        axios.get('http://localhost:3000/api/tabungan', getAuthConfig()),
        axios.get('http://localhost:3000/api/nasabah', getAuthConfig()),
        axios.get('http://localhost:3000/api/sampah', getAuthConfig())
      ]);
      setTabunganList(tabunganRes.data.data);
      setNasabahList(nasabahRes.data);
      setSampahList(sampahRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const openModal = (tabungan = null) => {
    if (tabungan) {
      setFormData({
        id_nasabah: tabungan.id_nasabah,
        jenis_sampah: tabungan.jenis_sampah,
        berat: tabungan.berat
      });
      setSelectedTabungan(tabungan);
    } else {
      setFormData({ id_nasabah: '', jenis_sampah: '', berat: '' });
      setSelectedTabungan(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ id_nasabah: '', jenis_sampah: '', berat: '' });
    setSelectedTabungan(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        jenis_sampah: formData.jenis_sampah,
        berat: Number(formData.berat)
      };

      if (selectedTabungan) {
        await axios.put(
          `http://localhost:3000/api/tabungan/${selectedTabungan.id}`,
          payload,
          getAuthConfig()
        );
      } else {
        await axios.post(
          'http://localhost:3000/api/tabungan',
          formData,
          getAuthConfig()
        );
      }

      fetchAllData();
      closeModal();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus data penimbangan ini?')) {
      try {
        await axios.delete(`http://localhost:3000/api/tabungan/${id}`, getAuthConfig());
        fetchAllData();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const getNamaNasabah = (id) => {
    const nasabah = nasabahList.find(n => n.id === id);
    return nasabah ? nasabah.nama : '-';
  };

  const getHargaSampah = (jenis) => {
    const item = sampahList.find(s => s.jenis_sampah === jenis);
    return item ? item.harga : 0;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold">Dashboard Petugas</h2>
      <p className="text-sm text-gray-600">Kelola operasional bank sampah harian</p>

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold mt-4">Penimbangan Sampah</h3>
        <button
          onClick={() => openModal()}
          className="flex bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <FaPlus className='my-1 mr-2'/> Input Penimbangan
        </button>
      </div>

      <div className="bg-white shadow rounded">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">Nasabah</th>
              <th className="p-3">Jenis Sampah</th>
              <th className="p-3">Harga/kg</th>
              <th className="p-3">Berat</th>
              <th className="p-3">Total</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tabunganList.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-3">{getNamaNasabah(t.id_nasabah)}</td>
                <td className="p-3">{t.jenis_sampah}</td>
                <td className="p-3">Rp {getHargaSampah(t.jenis_sampah)}</td>
                <td className="p-3">{t.berat} kg</td>
                <td className="p-3">Rp {t.total.toLocaleString()}</td>
                <td className="p-3">{new Date(t.created_at).toLocaleDateString()}</td>
                <td className="p-3 flex gap-2">
                  <button
                    className="p-2 border rounded text-gray-700 hover:bg-gray-100"
                    onClick={() => openModal(t)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-2 border rounded text-red-500 border-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(t.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">{selectedTabungan ? 'Edit Penimbangan' : 'Input Penimbangan'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!selectedTabungan && (
                <select
                  name="id_nasabah"
                  value={formData.id_nasabah}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                >
                  <option value="">Pilih Nasabah</option>
                  {nasabahList.map((n) => (
                    <option key={n.id} value={n.id}>{n.nama}</option>
                  ))}
                </select>
              )}
              <select
                name="jenis_sampah"
                value={formData.jenis_sampah}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Pilih Jenis Sampah</option>
                {sampahList.map((s) => (
                  <option key={s.id} value={s.jenis_sampah}>{s.jenis_sampah}</option>
                ))}
              </select>
              <input
                type="number"
                name="berat"
                placeholder="Berat (kg)"
                value={formData.berat}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
                required
              />
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

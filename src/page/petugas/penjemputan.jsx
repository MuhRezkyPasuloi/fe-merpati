import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaPlus } from 'react-icons/fa';

const Penjualan = () => {
  const [penjualanList, setPenjualanList] = useState([]);
  const [tabunganList, setTabunganList] = useState([]);
  const [nasabahList, setNasabahList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [jenisSampah, setJenisSampah] = useState('');
  const [hargaVendor, setHargaVendor] = useState('');
  const [selectedTabunganIds, setSelectedTabunganIds] = useState([]);

  useEffect(() => {
    fetchNasabah();
    fetchPenjualan();
    fetchTabungan();
  }, []);

  const fetchPenjualan = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/penjualan`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` }
      });
      setPenjualanList(res.data);
    } catch (err) {
      console.error('Fetch penjualan error:', err);
    }
  };

  const fetchTabungan = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tabungan?include=nasabah`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      setTabunganList(res.data.data || []);
    } catch (err) {
      console.error('Fetch tabungan error:', err);
    }
  };

  const fetchNasabah = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/nasabah`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` }
      });
      setNasabahList(res.data);
      
    } catch (err) {
      console.error('Fetch nasabah error:', err);
    }
  };

const getTabunganFiltered = () => {
  const safeTabungan = Array.isArray(tabunganList) ? tabunganList : [];
  const safeNasabah = Array.isArray(nasabahList) ? nasabahList : [];

  

  const hasil = safeTabungan
    .filter(t => t.jenis_sampah === jenisSampah && !t.sudah_dijual)
    .map(t => {
      const nasabah = safeNasabah.find(
        n => Number(n.id) === Number(t.id_nasabah)
      );

      return {
        ...t,
        nama_nasabah: nasabah?.nama || 'Tidak diketahui',
      };
    });

  return hasil;
};




  const handleCheckboxChange = (id) => {
    setSelectedTabunganIds(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setJenisSampah('');
    setHargaVendor('');
    setSelectedTabunganIds([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kirim data minimal yang dibutuhkan backend
      const promises = selectedTabunganIds.map(async (tabunganId) => {
        const tabungan = tabunganList.find(t => t.id === tabunganId);
        return axios.post(`${import.meta.env.VITE_API_URL}/api/penjualan`, {
          id_tabungan: tabunganId,
          id_nasabah: tabungan.id_nasabah,
          jenis_sampah: jenisSampah,
          harga_vendor: hargaVendor
        }, {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        });
      });

      await Promise.all(promises);
      fetchPenjualan();
      fetchTabungan();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Dashboard Petugas</h1>
        <p className="text-sm text-gray-500">Kelola Data Bank Sampah Umum Merpati</p>
      </div>

      {/* Action */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#111827]">Manajemen Penjualan</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <FaPlus /> Tambah Penjualan
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded border">
        <table className="min-w-full text-sm text-left text-gray-500 border border-gray-300">
          <thead className="text-xs text-white uppercase bg-green-700">
            <tr>
              <th className="p-2 text-center">No</th>
              <th className="p-2 text-center">Nama Nasabah</th>
              <th className="p-2 text-center">Jenis Sampah</th>
              <th className="p-2 text-center">Berat (kg)</th>
              <th className="p-2 text-center">Harga/kg</th>
              <th className="p-2 text-center">Total</th>
              <th className="p-2 text-center">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {penjualanList.length > 0 ? (
              penjualanList.map((p, index) => (
                <tr key={p.id} className="text-center border-b">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{p.nasabah?.nama || 'Tidak diketahui'}</td>
                  <td className="py-2 px-4 capitalize">{p.jenis_sampah}</td>
                  <td className="py-2 px-4">{p.berat} kg</td>
                  <td className="py-2 px-4">Rp {p.harga?.toLocaleString()}</td>
                  <td className="py-2 px-4">Rp {p.total?.toLocaleString()}</td>
                  <td className="py-2 px-4">
                    {new Date(p.tanggal_penjualan).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  Tidak ada data penjualan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl space-y-4"
          >
            <h3 className="text-lg font-semibold">Tambah Penjualan</h3>

            {/* Pilih Jenis Sampah */}
            <div>
              <label className="block text-sm mb-1">Jenis Sampah</label>
              <select
                value={jenisSampah}
                onChange={(e) => {
                  setJenisSampah(e.target.value);
                  setSelectedTabunganIds([]);
                }}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Pilih Jenis Sampah</option>
                {[...new Set(
                  tabunganList
                    .filter(t => !t.sudah_dijual) // hanya yang belum dijual
                    .map(t => t.jenis_sampah)
                )].map((jenis, i) => (
                  <option key={i} value={jenis}>{jenis}</option>
                ))}
              </select>
            </div>

            {/* Pilih Tabungan */}
            {jenisSampah && (
              <div>
                <label className="block text-sm mb-1">Pilih Tabungan</label>
                <div className="border p-2 rounded max-h-40 overflow-y-auto space-y-1">
                  {getTabunganFiltered().map((t) => (
                    <label key={t.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTabunganIds.includes(t.id)}
                        onChange={() => handleCheckboxChange(t.id)}
                      />
                      {t.nama_nasabah} - {t.berat} kg
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Harga Vendor */}
            <div>
              <label className="block text-sm mb-1">Harga Vendor</label>
              <input
                type="number"
                value={hargaVendor}
                onChange={(e) => setHargaVendor(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            {/* Tombol */}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Penjualan;

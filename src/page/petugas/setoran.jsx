import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const Tabungan = () => {
  const [groupedData, setGroupedData] = useState([]);

  const fetchTabungan = async () => {
    try {
      const token = Cookies.get('token'); 
      if (!token) {
        console.error('Token tidak ditemukan');
        return;
      }

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tabungan`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = res.data.data;

      // Filter hanya yang belum terjual
      const belumTerjual = data.filter(item => !item.sudah_dijual);

      // Group by jenis_sampah, simpan tanggal & status
      const grouped = Object.values(
        belumTerjual.reduce((acc, item) => {
          if (!acc[item.jenis_sampah]) {
            acc[item.jenis_sampah] = {
              jenis_sampah: item.jenis_sampah,
              total_berat: 0,
              tanggal: item.created_at,
              status: 'Belum Dijual'
            };
          }
          acc[item.jenis_sampah].total_berat += item.berat;
          return acc;
        }, {})
      );

      setGroupedData(grouped);
    } catch (err) {
      console.error('Gagal mengambil data tabungan:', err);
    }
  };

  useEffect(() => {
    fetchTabungan();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Dashboard Petugas</h1>
        <p className="text-sm text-gray-500">Kelola Data Bank Sampah Umum Merpati</p>
      </div>
      <h2 className="text-xl font-bold mb-4">Tabungan Belum Terjual</h2>
      <table className="w-full border-collapse bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">No</th>
            <th className="p-3 border">Jenis Sampah</th>
            <th className="p-3 border">Total Berat (kg)</th>
            <th className="p-3 border">Tanggal</th>
            <th className="p-3 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {groupedData.length > 0 ? (
            groupedData.map((item, index) => (
              <tr key={index}>
                <td className="p-3 border text-center">{index + 1}</td>
                <td className="p-3 border">{item.jenis_sampah}</td>
                <td className="p-3 border text-center">{item.total_berat} kg</td>
                <td className="p-3 border">
                  {new Date(item.tanggal).toLocaleDateString('id-ID')}
                </td>
                <td className="p-3 border font-semibold">
                  {item.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-3 text-center text-gray-500">
                Tidak ada data tabungan belum terjual
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tabungan;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';

const bulanOptions = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const tahunOptions = (() => {
  const tahunSekarang = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => tahunSekarang - i);
})();

const ArsipLaporan = () => {
  const [arsip, setArsip] = useState([]);
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const token = Cookie.get('token');

  const fetchArsip = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/laporan/arsip`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArsip(res.data.data);
    } catch (err) {
      console.error('Gagal memuat arsip laporan:', err);
    }
  };

  const handleGenerate = async () => {
    try {
      const res = await axios.get(`h${import.meta.env.VITE_API_URL}/api/laporan/bulanan?bulan=${bulan}&tahun=${tahun}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchArsip(); // Refresh arsip
    } catch (err) {
      alert('Gagal membuat laporan');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchArsip();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">Dashboard Arsip Laporan</h1>

      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select
          value={bulan}
          onChange={(e) => setBulan(Number(e.target.value))}
          className="border px-3 py-2 rounded-md text-sm"
        >
          {bulanOptions.map((bln, i) => (
            <option key={i + 1} value={i + 1}>{bln}</option>
          ))}
        </select>
        <select
          value={tahun}
          onChange={(e) => setTahun(Number(e.target.value))}
          className="border px-3 py-2 rounded-md text-sm"
        >
          {tahunOptions.map((th) => (
            <option key={th} value={th}>{th}</option>
          ))}
        </select>
        <button
          onClick={handleGenerate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Buat Laporan Bulanan
        </button>
      </div>

      {arsip.length === 0 ? (
        <p className="text-gray-500 text-sm">Belum ada arsip laporan tersimpan.</p>
      ) : (
        arsip.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="font-semibold mb-2">
              {bulanOptions[item.bulan - 1]} {item.tahun}
              <span className="text-sm text-gray-500 ml-2">
                (dibuat: {format(new Date(item.createdAt), 'dd MMMM yyyy HH:mm', { locale: idLocale })})
              </span>
            </h2>
            {item.data.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-collapse">
                  <thead className="bg-gray-100 border">
                    <tr>
                      <th className="px-4 py-2 border">No</th>
                      <th className="px-4 py-2 border">Nama Nasabah</th>
                      <th className="px-4 py-2 border">Jenis Sampah</th>
                      <th className="px-4 py-2 border">Tanggal Menabung</th>
                      <th className="px-4 py-2 border">Berat (kg)</th>
                      <th className="px-4 py-2 border">Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.data.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2 border">{index + 1}</td>
                        <td className="px-4 py-2 border capitalize">{row.nama_nasabah}</td>
                        <td className="px-4 py-2 border capitalize">{row.jenis_sampah}</td>
                        <td className="px-4 py-2 border">
                          {new Date(row.tanggal_menabung).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-4 py-2 border">{row.total_berat}</td>
                        <td className="px-4 py-2 border">Rp {row.total_nominal.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-sm mt-2">Tidak ada data pada laporan ini.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ArsipLaporan;

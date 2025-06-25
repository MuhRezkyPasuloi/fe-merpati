// src/page/nasabah/HargaSampah.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBalanceScale, FaCalculator } from 'react-icons/fa';

const HargaSampah = () => {
  const [dataSampah, setDataSampah] = useState([]);
  const [jenisSampah, setJenisSampah] = useState('');
  const [berat, setBerat] = useState('');
  const [hasil, setHasil] = useState(null);

  useEffect(() => {
    const fetchSampah = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/sampah');
        setDataSampah(res.data);
      } catch (err) {
        console.error('Gagal mengambil data sampah:', err);
      }
    };

    fetchSampah();
  }, []);

  const handleSimulasi = () => {
    const selected = dataSampah.find((item) => item.id === parseInt(jenisSampah));
    if (selected && berat) {
      const total = selected.harga * parseFloat(berat);
      setHasil(`Rp ${total.toLocaleString('id-ID')}`);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Daftar Harga Sampah</h1>

      {/* Daftar Harga */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dataSampah.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 bg-white">
            <p className="font-semibold text-gray-800 capitalize">{item.jenis_sampah}</p>
            <p className="text-sm text-gray-500 mb-1">Stok: {item.stok} kg</p>
            <p className="text-green-600 font-bold">Rp {item.harga.toLocaleString('id-ID')}/kg</p>
          </div>
        ))}
      </div>

      {/* Simulasi */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaCalculator /> Simulasi Setoran Sampah
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-gray-700">Jenis Sampah</label>
            <select
              value={jenisSampah}
              onChange={(e) => setJenisSampah(e.target.value)}
              className="w-full mt-1 border rounded-md px-3 py-2 text-sm"
            >
              <option value="">Pilih jenis sampah</option>
              {dataSampah.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.jenis_sampah}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Berat (kg)</label>
            <div className="flex items-center border rounded-md mt-1 px-3 py-2">
              <FaBalanceScale className="text-gray-400 mr-2" />
              <input
                type="number"
                min="0"
                value={berat}
                onChange={(e) => setBerat(e.target.value)}
                placeholder="Masukkan berat"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleSimulasi}
            className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-md py-2 px-4 text-sm font-semibold"
          >
            Hitung Simulasi
          </button>
        </div>

        {hasil && (
          <p className="text-green-600 font-semibold text-sm mt-2">
            Estimasi Penghasilan: {hasil}
          </p>
        )}
      </div>

      {/* Informasi Tambahan */}
      <div className="bg-white border rounded-lg p-6 text-sm text-gray-700 leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Informasi Tambahan</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Harga dapat berubah sewaktu-waktu sesuai kondisi pasar</li>
          <li>Sampah harus dalam kondisi bersih dan kering</li>
          <li>Minimal setoran 1 kg untuk setiap jenis sampah</li>
          <li>Bonus tambahan untuk nasabah setiap bulannya</li>
        </ul>
      </div>
    </div>
  );
};

export default HargaSampah;

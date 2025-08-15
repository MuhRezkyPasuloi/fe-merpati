// src/page/nasabah/HargaSampah.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBalanceScale, FaCalculator } from "react-icons/fa";

const HargaSampah = () => {
  const [dataSampah, setDataSampah] = useState([]);
  const [jenisSampah, setJenisSampah] = useState("");
  const [berat, setBerat] = useState("");
  const [hasil, setHasil] = useState(null);

  useEffect(() => {
    const fetchSampah = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/sampah`);
        setDataSampah(res.data);
      } catch (err) {
        console.error("Gagal mengambil data sampah:", err);
      }
    };

    fetchSampah();
  }, []);

  const handleSimulasi = () => {
    const selected = dataSampah.find(
      (item) => item.id === parseInt(jenisSampah)
    );
    if (selected && berat) {
      const total = selected.harga * parseFloat(berat);
      setHasil(`Rp ${total.toLocaleString("id-ID")}`);
    }
  };

  // Fungsi buat bagi data jadi row sesuai jumlah pasangan kolom
  const generateRows = (pairsPerRow) => {
    const rows = [];
    for (let i = 0; i < dataSampah.length; i += pairsPerRow) {
      const row = [];
      for (let j = 0; j < pairsPerRow; j++) {
        const item = dataSampah[i + j];
        row.push(item || null);
      }
      rows.push(row);
    }
    return rows;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Daftar Harga Sampah</h1>

      {/* Daftar Harga */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4 overflow-x-auto">
        {/* Mobile: 2 pasangan kolom */}
        <div className="block md:hidden">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Jenis Sampah</th>
                <th className="border px-4 py-2">Harga</th>
                <th className="border px-4 py-2">Jenis Sampah</th>
                <th className="border px-4 py-2">Harga</th>
              </tr>
            </thead>
            <tbody>
              {generateRows(2).map((row, idx) => (
                <tr key={idx}>
                  {row.map((item, i) => (
                    <React.Fragment key={i}>
                      <td className="border px-4 py-2 capitalize">
                        {item?.jenis_sampah || ""}
                      </td>
                      <td className="border px-4 py-2">
                        {item
                          ? `Rp ${item.harga.toLocaleString("id-ID")}`
                          : ""}
                      </td>
                    </React.Fragment>
                  ))}
                  {/* Jika jumlah item di baris ganjil, isi kosong */}
                  {row.length < 2 && (
                    <>
                      <td className="border px-4 py-2"></td>
                      <td className="border px-4 py-2"></td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Desktop: 3 pasangan kolom */}
        <div className="hidden md:block">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Jenis Sampah</th>
                <th className="border px-4 py-2">Harga</th>
                <th className="border px-4 py-2">Jenis Sampah</th>
                <th className="border px-4 py-2">Harga</th>
                <th className="border px-4 py-2">Jenis Sampah</th>
                <th className="border px-4 py-2">Harga</th>
              </tr>
            </thead>
            <tbody>
              {generateRows(3).map((row, idx) => (
                <tr key={idx}>
                  {row.map((item, i) => (
                    <React.Fragment key={i}>
                      <td className="border px-4 py-2 capitalize">
                        {item?.jenis_sampah || ""}
                      </td>
                      <td className="border px-4 py-2">
                        {item
                          ? `Rp ${item.harga.toLocaleString("id-ID")}`
                          : ""}
                      </td>
                    </React.Fragment>
                  ))}
                  {/* Jika jumlah item di baris kurang dari 3, isi kosong */}
                  {row.length < 3 &&
                    Array.from({ length: 3 - row.length }).map((_, k) => (
                      <React.Fragment key={`empty-${k}`}>
                        <td className="border px-4 py-2"></td>
                        <td className="border px-4 py-2"></td>
                      </React.Fragment>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulasi */}
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaCalculator /> Simulasi Tabungan Sampah
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Jenis Sampah
            </label>
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
            <label className="text-sm font-medium text-gray-700">
              Berat (kg)
            </label>
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
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Informasi Tambahan
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Harga dapat berubah sewaktu-waktu sesuai kondisi pasar</li>
          <li>Sampah harus dalam kondisi bersih dan kering</li>
          <li>Minimal Tabungan 1 kg untuk setiap jenis sampah</li>
          <li>Bonus tambahan untuk nasabah setiap bulannya</li>
        </ul>
      </div>
    </div>
  );
};

export default HargaSampah;

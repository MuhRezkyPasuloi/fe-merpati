import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaCalendarCheck, FaBalanceScale, FaMoneyBill } from 'react-icons/fa';

const RiwayatItem = ({ tanggal, jenis, berat, harga, penghasilan }) => (
  <div className="bg-white border rounded-lg p-4 flex justify-between items-center shadow-sm">
    <div className="flex items-start space-x-4">
      <div className="text-green-500 bg-green-100 p-2 rounded-full">
        <FaCalendarCheck size={20} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Setoran {tanggal}</h3>
        <div className="mt-2 space-y-1 text-sm text-gray-700">
          <p>
            <span className="font-medium">Jenis Sampah:</span>{' '}
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">{jenis}</span>
          </p>
          <p className="flex items-center gap-1">
            <span className="font-medium">Berat:</span>
            <FaBalanceScale className="text-blue-500" /> {berat} kg
          </p>
          <p>
            <span className="font-medium">Harga/Kg:</span>{' '}
            Rp {harga.toLocaleString('id-ID')}
          </p>
          <p className="flex items-center gap-1">
            <span className="font-medium">Penghasilan:</span>{' '}
            <FaMoneyBill className="text-green-500" />{' '}
            <span className="text-green-600 font-bold">Rp {penghasilan.toLocaleString('id-ID')}</span>
          </p>
        </div>
      </div>
    </div>
    <button className="text-blue-600 text-sm font-medium border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded">
      Lihat Detail
    </button>
  </div>
);

const SetoranSampah = () => {
  const [riwayat, setRiwayat] = useState([]);

  const fetchRiwayat = async () => {
  try {
    const token = Cookies.get('token'); // Ganti dari localStorage ke Cookies

    const res = await axios.get('http://localhost:3000/api/tabungan/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setRiwayat(res.data.data || []);
  } catch (error) {
    console.error('Gagal mengambil data riwayat setoran:', error);
  }
};

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const formatTanggal = (tanggalISO) => {
    return new Date(tanggalISO).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Setoran Sampah</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">📅 Buka setiap hari (08:00 - 16:00)</p>
      </div>

      {/* Informasi Setoran */}
      <div className="bg-white border rounded-lg p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800">Informasi Setoran Sampah</h2>
        <div className="bg-green-50 border border-green-200 text-green-800 rounded p-4 text-sm">
          <p className="font-semibold mb-2">Cara Melakukan Setoran Sampah</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Pisahkan sampah sesuai kategori (Plastik, Kertas, Logam, Kaca)</li>
            <li>Datang ke Bank Sampah HijauCycle pada jam operasional</li>
            <li>Petugas akan menimbang sampah dan mencatat setoran</li>
            <li>Nilai setoran akan langsung ditambahkan ke saldo akun Anda</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="font-semibold text-gray-800 mb-1">📅 Jam Operasional</p>
            <p>Senin – Sabtu: 08:00 - 16:00</p>
            <p>Minggu: 09:00 - 13:00</p>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="font-semibold text-gray-800 mb-1">⚖️ Minimal Setoran</p>
            <p>1 kg untuk setiap jenis sampah</p>
            <p>Pastikan sampah sudah dibersihkan dan dikeringkan</p>
          </div>
        </div>
      </div>

      {/* Riwayat Setoran */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Setoran</h2>
        {riwayat.length > 0 ? (
          <div className="space-y-4">
            {riwayat.map((item) => (
              <RiwayatItem
                key={item.id}
                tanggal={formatTanggal(item.created_at)}
                jenis={item.jenis_sampah}
                harga={item.harga}
                berat={item.berat}
                penghasilan={item.total}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Belum ada data setoran.</p>
        )}
      </div>
    </div>
  );
};

export default SetoranSampah;

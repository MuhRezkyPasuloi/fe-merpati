import React from 'react';

import { FaTruck, FaBalanceScale, FaUser, FaMoneyBill } from 'react-icons/fa';

const Penjemputan = () => {


  const jadwalData = [
    { nama: 'John Doe', alamat: 'Jl. Mawar No. 123', waktu: '09:00', status: 'pending' },
    { nama: 'Jane Smith', alamat: 'Jl. Melati No. 456', waktu: '10:30', status: 'selesai' },
    { nama: 'Bob Wilson', alamat: 'Jl. Anggrek No. 789', waktu: '14:00', status: 'pending' },
    { nama: 'Alice Brown', alamat: 'Jl. Tulip No. 321', waktu: '15:30', status: 'pending' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      <main className="flex-1 p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Dashboard Petugas</h1>
        <p className="text-sm text-gray-500 mb-6">Kelola operasional bank sampah harian</p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Penjemputan Hari Ini</p>
              <p className="text-xl font-semibold">12</p>
            </div>
            <FaTruck className="text-blue-500 text-xl" />
          </div>
          <div className="bg-white shadow rounded p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Total Sampah</p>
              <p className="text-xl font-semibold">245 kg</p>
            </div>
            <FaBalanceScale className="text-green-500 text-xl" />
          </div>
          <div className="bg-white shadow rounded p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Nasabah Dilayani</p>
              <p className="text-xl font-semibold">35</p>
            </div>
            <FaUser className="text-purple-500 text-xl" />
          </div>
          <div className="bg-white shadow rounded p-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pembayaran Diproses</p>
              <p className="text-xl font-semibold">Rp 1.2M</p>
            </div>
            <FaMoneyBill className="text-green-600 text-xl" />
          </div>
        </div>

        {/* Jadwal Penjemputan */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Jadwal Penjemputan</h2>
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">+ Tambah Jadwal</button>
        </div>
        <div className="space-y-4">
          {jadwalData.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.nama}</h3>
                <p className="text-sm text-gray-500">{item.alamat}</p>
                <p className="text-sm text-gray-500">Waktu: {item.waktu}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'pending' ? 'bg-gray-100 text-gray-700' : 'bg-gray-900 text-white'}`}>
                  {item.status === 'pending' ? 'Pending' : 'Selesai'}
                </span>
                {item.status === 'pending' && (
                  <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">Selesaikan</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Penjemputan;

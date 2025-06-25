// src/pages/DashboardAdmin.jsx
import React from 'react';

import { FaUser, FaTruck, FaChartBar } from 'react-icons/fa';


const OverviewAdmin = () => {
  

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#111827]">
      
      <main className="flex-1 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-sm text-gray-500">Kelola sistem bank sampah HijauCycle</p>
        </div>

        {/* Statistik Kartu */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Nasabah" value="1,234" icon={<FaUser />} color="bg-blue-100" />
          <StatCard title="Total Petugas" value="45" icon={<FaTruck />} color="bg-green-100" />
          <StatCard title="Sampah Terkumpul" value="2,500 kg" icon={<FaChartBar />} color="bg-purple-100" />
          <StatCard title="Revenue Bulan Ini" value="Rp 15.5M" icon={<FaChartBar />} color="bg-green-100" />
        </div>

        {/* Aktivitas Terbaru */}
        <section>
          <h2 className="text-lg font-bold mb-4">Aktivitas Terbaru</h2>
          <div className="space-y-3">
            {[
              { name: 'John Doe mendaftar', detail: 'Nasabah Baru • 2 menit lalu', status: 'Berhasil' },
              { name: 'Jane Smith - Rp 150,000', detail: 'Penarikan • 15 menit lalu', status: 'Pending' },
              { name: 'Bob Wilson - 25 kg', detail: 'Setoran Sampah • 1 jam lalu', status: 'Berhasil' },
              { name: 'Alice Brown bergabung', detail: 'Petugas Baru • 3 jam lalu', status: 'Berhasil' },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-4 rounded shadow-sm border">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.detail}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full
                  ${item.status === 'Berhasil' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-4 rounded shadow-sm flex items-center justify-between border">
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
    <div className={`w-10 h-10 flex items-center justify-center rounded-md ${color}`}>
      <div className="text-lg text-gray-700">{icon}</div>
    </div>
  </div>
);

export default OverviewAdmin;

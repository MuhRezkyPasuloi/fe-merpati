import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { FaUser, FaTruck, FaChartBar } from 'react-icons/fa';

const OverviewAdmin = () => {
  const [stats, setStats] = useState({
    nasabah: 0,
    petugas: 0,
    totalBerat: 0,
    totalRevenue: 0,
    aktivitas: [],
  });

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const token = Cookies.get('token');

      const [nasabahRes, petugasRes, tabunganRes, penarikanRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/nasabah`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/petugas`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/tabungan`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/penarikan`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const nasabahList = nasabahRes.data || [];
      const tabungan = tabunganRes.data?.data || [];
      const penarikan = penarikanRes.data?.data || [];

      // Sampah terkumpul (belum terjual)
      const totalBerat = tabungan
        .filter(item => !item.sudah_dijual)
        .reduce((acc, item) => acc + item.berat, 0);

      // Revenue bulan ini (total pendapatan tabungan di bulan ini)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const totalRevenue = tabungan
        .filter(item => {
          const tgl = new Date(item.created_at);
          return tgl.getMonth() === currentMonth && tgl.getFullYear() === currentYear;
        })
        .reduce((acc, item) => acc + item.total, 0);

      // Gabungkan aktivitas tabungan & penarikan
      const aktivitasTabungan = tabungan.slice(-5).map(item => {
        const nasabah = nasabahList.find(n => n.id === item.id_nasabah);
        return {
          keterangan: `${nasabah ? nasabah.nama : "Nasabah"} menabung ${item.jenis_sampah} (${item.berat} kg)`,
          waktu: new Date(item.created_at),
          status: 'Tabungan',
        };
      });

      const aktivitasPenarikan = penarikan.slice(-5).map(item => {
        const nasabah = nasabahList.find(n => n.id === item.id_nasabah);
        return {
          keterangan: `${nasabah ? nasabah.nama : "Nasabah"} menarik Rp ${item.nominal.toLocaleString('id-ID')}`,
          waktu: new Date(item.tgl_penarikan),
          status: item.status === 'disetujui' ? 'Berhasil' : 'Pending',
        };
      });

      // Gabungkan, urutkan, ambil 5 terbaru
      const aktivitasTerbaru = [...aktivitasTabungan, ...aktivitasPenarikan]
        .sort((a, b) => b.waktu - a.waktu)
        .slice(0, 5)
        .map(item => ({
          ...item,
          waktu: item.waktu.toLocaleString('id-ID'),
        }));

      setStats({
        nasabah: nasabahList.length,
        petugas: Array.isArray(petugasRes.data) ? petugasRes.data.length : 0,
        totalBerat,
        totalRevenue,
        aktivitas: aktivitasTerbaru,
      });

    } catch (err) {
      console.error("Gagal mengambil statistik admin:", err);
    }
  };

  fetchStats();
}, []);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#111827]">
      <main className="flex-1 p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <p className="text-sm text-gray-500">Kelola sistem BSU Merpati</p>
        </div>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Nasabah"
            value={stats.nasabah.toLocaleString('id-ID')}
            icon={<FaUser />}
            color="bg-blue-100"
          />
          <StatCard
            title="Total Petugas"
            value={stats.petugas.toLocaleString('id-ID')}
            icon={<FaTruck />}
            color="bg-green-100"
          />
          <StatCard
            title="Sampah Terkumpul"
            value={`${stats.totalBerat.toLocaleString('id-ID')} kg`}
            icon={<FaChartBar />}
            color="bg-purple-100"
          />
          <StatCard
            title="Revenue Bulan Ini"
            value={`Rp ${stats.totalRevenue.toLocaleString('id-ID')}`}
            icon={<FaChartBar />}
            color="bg-green-100"
          />
        </div>

        {/* Aktivitas Terbaru */}
        <section>
          <h2 className="text-lg font-bold mb-4">Aktivitas Terbaru</h2>
          <div className="space-y-3">
            {stats.aktivitas && stats.aktivitas.length > 0 ? (
              stats.aktivitas.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-white p-4 rounded shadow-sm border"
                >
                  <div>
                    <p className="font-semibold">{item.keterangan}</p>
                    <p className="text-sm text-gray-500">{item.waktu}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      item.status === 'Berhasil'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Tidak ada aktivitas terbaru.</p>
            )}
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

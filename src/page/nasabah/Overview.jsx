import React from 'react';


import {
  FaWallet,
  FaBalanceScale,
  FaTruck,
  FaChartLine,
  FaArrowCircleDown
} from 'react-icons/fa';

const Card = ({ title, value, Icon, iconBg, iconColor }) => (
  <div className="bg-white rounded-lg border border-[#E6E8F0] p-4 flex items-center justify-between">
    <div>
      <p className="text-xs text-[#6B7280]">{title}</p>
      <p className="font-bold text-sm text-[#111827] mt-1">{value}</p>
    </div>
    <div className={`flex items-center justify-center w-8 h-8 rounded-md ${iconBg} ${iconColor}`}>
      {Icon && <Icon className="text-sm" />}
    </div>
  </div>
);

const ActionButton = ({ children, Icon, primary }) =>
  primary ? (
    <button className="w-full flex items-center space-x-2 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-semibold rounded-md py-2 px-3">
      {Icon && <Icon className="mr-2" />}
      <span>{children}</span>
    </button>
  ) : (
    <button className="w-full flex items-center space-x-2 border border-[#E6E8F0] text-xs text-[#374151] rounded-md py-2 px-3 hover:bg-gray-50">
      {Icon && <Icon className="mr-2" />}
      <span>{children}</span>
    </button>
  );

const Contribution = () => (
  <div className="bg-white rounded-lg border border-[#E6E8F0] p-4">
    <h2 className="font-bold text-sm text-[#111827] mb-3">Kontribusi Lingkungan</h2>
    <div className="flex justify-between text-xs text-[#374151] mb-1">
      <span>CO₂ Berkurang</span>
      <span className="text-[#047857] font-semibold">-45 kg</span>
    </div>
    <div className="flex justify-between text-xs text-[#374151] mb-1">
      <span>Pohon Diselamatkan</span>
      <span className="text-[#047857] font-semibold">~3 pohon</span>
    </div>
    <div className="flex justify-between text-xs text-[#374151]">
      <span>Rank Kontributor</span>
      <span className="bg-[#111827] text-white text-[9px] font-semibold rounded-full px-2 py-0.5">Top 15%</span>
    </div>
  </div>
);

const TransactionItem = ({ title, subtitle, value, valueColor, status }) => (
  <li className="border border-[#E6E8F0] rounded-md p-3 flex justify-between items-center">
    <div>
      <p className="text-xs text-[#374151]">{title}</p>
      <p className="text-[10px] text-[#9CA3AF] mt-0.5">{subtitle}</p>
    </div>
    <div className="text-right">
      <p className={`text-xs font-semibold ${valueColor}`}>{value}</p>
      <span className="bg-[#111827] text-white text-[9px] font-semibold rounded-full px-2 py-0.5 inline-block mt-1">{status}</span>
    </div>
  </li>
);

const Overview = () => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#111827]">
      
      <main className="flex-1 p-6 space-y-6">
        <header>
          <h1 className="text-lg font-bold">Selamat Datang, John!</h1>
          <p className="text-xs text-[#6B7280] mt-1">Pantau aktivitas bank sampah Anda</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card
            title="Saldo Saat Ini"
            value="Rp 250,000"
            Icon={FaWallet}
            iconBg="bg-[#A7E9D0]"
            iconColor="text-[#065F46]"
          />
          <Card
            title="Total Sampah"
            value="125 kg"
            Icon={FaBalanceScale}
            iconBg="bg-[#BFDBFE]"
            iconColor="text-[#2563EB]"
          />
          <Card
            title="Penjemputan Bulan Ini"
            value="8"
            Icon={FaTruck}
            iconBg="bg-[#E9D5FF]"
            iconColor="text-[#7C3AED]"
          />
          <Card
            title="Penghasilan Bulan Ini"
            value="Rp 75,000"
            Icon={FaChartLine}
            iconBg="bg-[#D1FAE5]"
            iconColor="text-[#065F46]"
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-lg border border-[#E6E8F0] p-4 space-y-3">
            <h2 className="font-bold text-sm text-[#111827]">Aksi Cepat</h2>
            <ActionButton Icon={FaBalanceScale} primary>
              Lihat Setoran Sampah
            </ActionButton>
            <ActionButton Icon={FaArrowCircleDown}>
              Tarik Saldo
            </ActionButton>
          </div>
          <Contribution />
        </section>

        <section className="bg-white rounded-lg border border-[#E6E8F0] p-4">
          <h2 className="font-bold text-sm text-[#111827] mb-4">Transaksi Terbaru</h2>
          <ul className="space-y-4">
            <TransactionItem
              title="Setoran Plastik"
              subtitle="5.5 kg • 2024-01-15"
              value="+Rp 11,000"
              valueColor="text-[#047857]"
              status="Selesai"
            />
            <TransactionItem
              title="Penarikan Saldo"
              subtitle="2024-01-14"
              value="-Rp 50,000"
              valueColor="text-[#2563EB]"
              status="Selesai"
            />
            <TransactionItem
              title="Setoran Kertas"
              subtitle="8.2 kg • 2024-01-13"
              value="+Rp 16,400"
              valueColor="text-[#047857]"
              status="Selesai"
            />
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Overview;

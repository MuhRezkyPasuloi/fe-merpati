import React, { useState } from 'react';
import Sidebar from '../components/SidebarPetugas';
import Penjemputan from './petugas/penjemputan';
import Pembayaran from './petugas/pembayaran';
import Penimbangan from './petugas/penimbangan';
import Nasabah from './petugas/nasabah';
import Sampah from './petugas/sampah';

const DashboardPetugas = () => {
  const [activePage, setActivePage] = useState('penjemputan');

  const renderPage = () => {
    switch (activePage) {
      case 'penjemputan':
        return <Penjemputan />;
      case 'pembayaran':
        return <Pembayaran />;
      case 'penimbangan':
        return <Penimbangan />;
      case 'nasabah':
        return <Nasabah />;
      case 'sampah':
        return <Sampah />;
      default:
        return <Penjemputan />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-[#111827]">
      {/* Sidebar tetap di kiri */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Konten utama */}
      <main className="ml-60 w-full h-screen overflow-y-auto p-6 space-y-6">
        {renderPage()}
      </main>
    </div>
  );
};

export default DashboardPetugas;

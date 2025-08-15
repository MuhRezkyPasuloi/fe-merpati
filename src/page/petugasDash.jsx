import React, { useState } from 'react';
import Sidebar from '../components/SidebarPetugas';
import BottomNavPetugas from '../components/BottomNavPetugas';
import Penjemputan from './petugas/penjemputan';
import Pembayaran from './petugas/pembayaran';
import Penimbangan from './petugas/penimbangan';
import Nasabah from './petugas/nasabah';
import Sampah from './petugas/sampah';
import Setoran from './petugas/setoran';

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
      case 'setoran':
        return <Setoran />;
      case 'nasabah':
        return <Nasabah />;
      case 'sampah':
        return <Sampah />;
      default:
        return <Penjemputan />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#111827]">
      {/* Desktop */}
      <div className="hidden md:flex">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        <main className="ml-56 w-full h-screen overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <main className="pb-20 px-4 pt-4"> {/* extra bottom padding */}
          {renderPage()}
        </main>
        <BottomNavPetugas activePage={activePage} onNavigate={setActivePage} />
      </div>
    </div>
  );
};

export default DashboardPetugas;

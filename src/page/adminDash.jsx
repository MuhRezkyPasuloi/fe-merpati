import React, { useState } from 'react';
import Sidebar from '../components/SidebarAdmin';
import BottomNavAdmin from '../components/BottomNavAdmin';
import OverviewAdmin from './admin/Overview';
import ManajemenNasabah from './admin/ManajemenNasabah';
import ManajemenSampah from './admin/ManajemenSampah';
import ManajemenPetugas from './admin/ManajemenPetugas';
import Laporan from './admin/Laporan';
import ArsipLaporan from './admin/ArsipLaporan';
import LaporanTahunan from './admin/LaporanTahunan';

const DashboardAdmin = () => {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewAdmin />;
      case 'manajemen-nasabah':
        return <ManajemenNasabah />;
      case 'manajemen-sampah':
        return <ManajemenSampah />;
      case 'manajemen-petugas':
        return <ManajemenPetugas />;
      case 'laporan':
        return <Laporan />;
      case 'laporan-tahun':
        return <LaporanTahunan />;
      case 'arsip-laporan':
        return <ArsipLaporan />;
      default:
        return <OverviewAdmin />;
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
        <BottomNavAdmin activePage={activePage} onNavigate={setActivePage} />
      </div>
    </div>
  );
};

export default DashboardAdmin;
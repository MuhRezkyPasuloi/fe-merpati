import React, { useState } from 'react';
import Sidebar from '../components/SidebarNasabah';
import PenarikanSaldo from './nasabah/penarikanSaldo';
import Overview from './nasabah/Overview';
import SetoranSampah from './nasabah/SetoranSampah';
import HargaSampah from './nasabah/HargaSampah';
import Profil from './nasabah/Profil';

const DashboardNasabah = () => {
  const [activePage, setActivePage] = useState('overview');

  const renderPage = () => {
    switch (activePage) {
      case 'overview':
        return <Overview />;
      case 'profil':
        return <Profil />;
      case 'penarikan':
        return <PenarikanSaldo />;
      case 'setoran':
        return <SetoranSampah />;
      case 'harga':
        return <HargaSampah />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#111827]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="ml-56 w-full h-screen overflow-y-auto p-6">
        {renderPage()}
      </main>
    </div>
  );
};

export default DashboardNasabah;
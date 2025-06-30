// src/pages/DashboardNasabah.jsx
import React, { useState } from 'react';
import Sidebar from '../components/SidebarNasabah';
import BottomNav from '../components/BottomNavNasabah';

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
        return <Overview onNavigate={setActivePage} />;
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
        <BottomNav activePage={activePage} onNavigate={setActivePage} />
      </div>
    </div>
  );
};

export default DashboardNasabah;

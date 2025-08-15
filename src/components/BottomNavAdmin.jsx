// src/components/BottomNavNasabah.jsx
import React from 'react';
import {
  FaChartBar,
  FaTruck,
  FaTrash,
  FaFile,
  FaUsers,
} from 'react-icons/fa';

const navItems = [
  { key: 'overview', icon: <FaChartBar />, label: 'Overview' },
    { key: 'manajemen-nasabah', icon: <FaUsers />, label: 'Manajemen User' },
    { key: 'manajemen-petugas', icon: <FaTruck />, label: 'Manajemen Petugas' },
    { key: 'manajemen-sampah', icon: <FaTrash />, label: 'Manajemen Sampah' },
    {
      key: 'laporan',
      icon: <FaFile />,
      label: 'Laporan',
      submenu: [
        { key: 'laporan', label: 'Laporan Bulanan' },
        { key: 'laporan-tahun', label: 'Laporan Tahunan' },
        { key: 'arsip-laporan', label: 'Arsip Laporan' }
      ]
    }
];

const BottomNavAdmin = ({ activePage, onNavigate }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-md flex justify-between px-2 py-1 md:hidden">
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key)}
          className={`flex flex-col items-center justify-center flex-1 text-xs py-2 ${
            activePage === item.key ? 'text-green-600 font-semibold' : 'text-gray-500'
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavAdmin;

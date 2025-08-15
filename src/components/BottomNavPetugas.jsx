// src/components/BottomNavNasabah.jsx
import React from 'react';
import {
  FaCalendarAlt,
  FaTrash,
  FaMoneyBill,
  FaBalanceScale,
  FaUsers,
} from 'react-icons/fa';

const navItems = [
  { key: 'jadwal', icon: <FaCalendarAlt />, label: 'Penjualan' },
      { key: 'nasabah', icon: <FaUsers />, label: 'Data Nasabah' },
      { key: 'sampah', icon: <FaTrash />, label: 'Data Sampah' },
      //{ key: 'penimbangan', icon: <FaBalanceScale />, label: 'Tabungan' },
      {
            key: 'all',
            icon: <FaBalanceScale />,
            label: 'Tabungan',
            submenu: [
              { key: 'penimbangan', label: 'Semua' },
              { key: 'setoran', label: 'Belum Terjual' }
            ]
          },
      
      { key: 'pembayaran', icon: <FaMoneyBill />, label: 'Penarikan Saldo' },
];

const BottomNavPetugas = ({ activePage, onNavigate }) => {
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

export default BottomNavPetugas;

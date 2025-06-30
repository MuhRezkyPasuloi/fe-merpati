// src/components/BottomNavNasabah.jsx
import React from 'react';
import {
  FaHome,
  FaArrowCircleDown,
  FaBox,
  FaBalanceScale,
  FaUser,
} from 'react-icons/fa';

const navItems = [
  { key: 'overview', icon: <FaHome />, label: 'Home' },
  { key: 'penarikan', icon: <FaArrowCircleDown />, label: 'Penarikan' },
  { key: 'setoran', icon: <FaBox />, label: 'Tabungan' },
  { key: 'harga', icon: <FaBalanceScale />, label: 'Harga' },
  { key: 'profil', icon: <FaUser />, label: 'Profil' },
];

const BottomNavNasabah = ({ activePage, onNavigate }) => {
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

export default BottomNavNasabah;

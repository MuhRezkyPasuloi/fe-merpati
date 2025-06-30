// src/components/SidebarNasabah.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaWallet,
  FaChartBar,
  FaUser,
  FaArrowCircleDown,
  FaBox,
  FaBalanceScale,
  FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = ({ activePage, onNavigate }) => {
  const menuItems = [
    { key: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { key: 'profil', label: 'Profil', icon: <FaUser /> },
    { key: 'penarikan', label: 'Penarikan Saldo', icon: <FaArrowCircleDown /> },
    { key: 'setoran', label: 'Setoran Sampah', icon: <FaBox /> },
    { key: 'harga', label: 'Harga Sampah', icon: <FaBalanceScale /> }
  ];

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('profile');
    navigate('/');
  };

  return (
    <aside className="hidden md:flex fixed top-0 left-0 z-20 w-56 h-screen bg-white border-r border-gray-200 flex-col justify-between">
      <div>
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#A7E9D0] text-[#065F46]">
              <FaWallet className="text-lg" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">Dashboard</h2>
              <p className="text-xs text-[#6B7280]">John Doe</p>
            </div>
          </div>
        </div>
        <nav className="px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex items-center w-full px-4 py-2 rounded-md text-sm font-medium space-x-2 hover:bg-gray-100 ${
                activePage === item.key ? 'bg-green-100 text-green-800' : 'text-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center text-red-500 border border-red-500 w-full justify-center py-2 rounded hover:bg-red-50"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

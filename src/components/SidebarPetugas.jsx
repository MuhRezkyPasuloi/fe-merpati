import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  FaBalanceScale,
  FaCalendarAlt,
  FaMoneyBill,
  FaUsers,
  FaSignOutAlt,
  FaTrash,
  FaTruck,
} from 'react-icons/fa';

const SidebarPetugas = ({ activePage, onNavigate }) => {
  const menu = [
    { key: 'jadwal', icon: <FaCalendarAlt />, label: 'Jadwal Penjemputan' },
    { key: 'penimbangan', icon: <FaBalanceScale />, label: 'Penimbangan' },
    { key: 'pembayaran', icon: <FaMoneyBill />, label: 'Pembayaran' },
    { key: 'nasabah', icon: <FaUsers />, label: 'Data Nasabah' },
    { key: 'sampah', icon: <FaTrash />, label: 'Data Sampah' },
  ];

  const navigate = useNavigate();
  const handleLogout = () => {
    // Hapus data dari localStorage atau cookie
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('profile');

    // Atau kalau kamu pakai cookie, contoh:
    // document.cookie = "token=; max-age=0";

    // Redirect ke halaman login
   
    navigate('/');
  };

  return (
    <aside className="w-60 h-screen fixed top-0 left-0 bg-white border-r flex flex-col justify-between shadow">
      <div>
        {/* Header Sidebar */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#A7E9D0] text-[#065F46]">
              <FaTruck className="text-lg" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">Dashboard</h2>
              <p className="text-xs text-[#6B7280]">Petugas</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="px-4 space-y-2 mt-4">
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex items-center w-full px-4 py-2 rounded-md text-sm font-medium space-x-2 hover:bg-gray-100 ${
                activePage === item.key
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
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

export default SidebarPetugas;

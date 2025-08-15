// src/components/SidebarAdmin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaWallet,
  FaChartBar,
  FaUsers,
  FaTruck,
  FaTrash,
  FaFile,
  FaSignOutAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const SidebarAdmin = ({ activePage, onNavigate }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('profile');
    navigate('/');
  };

  return (
    <aside className="fixed top-0 left-0 z-20 w-56 h-screen bg-white border-r border-gray-200 flex flex-col justify-between">
      <div>
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#A7E9D0] text-[#065F46]">
              <FaWallet className="text-lg" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">Dashboard</h2>
              <p className="text-xs text-[#6B7280]">Admin</p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <div key={item.key}>
              <button
                onClick={() => {
                  if (item.submenu) {
                    setOpenSubmenu((prev) => (prev === item.key ? null : item.key));
                  } else {
                    onNavigate(item.key);
                  }
                }}
                className={`flex items-center justify-between w-full px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 ${
                  activePage === item.key ? 'bg-green-100 text-green-800' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.submenu && (
                  <span>
                    {openSubmenu === item.key ? <FaChevronUp /> : <FaChevronDown />}
                  </span>
                )}
              </button>

              {item.submenu && openSubmenu === item.key && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.submenu.map((sub) => (
                    <button
                      key={sub.key}
                      onClick={() => onNavigate(sub.key)}
                      className={`block text-left w-full text-sm px-4 py-2 rounded-md hover:bg-gray-100 ${
                        activePage === sub.key ? 'bg-green-100 text-green-800' : 'text-gray-600'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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

export default SidebarAdmin;

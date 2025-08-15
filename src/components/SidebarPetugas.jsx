import React, {useState} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  FaBalanceScale,
  FaCalendarAlt,
  FaMoneyBill,
  FaUsers,
  FaSignOutAlt,
  FaTrash,
  FaTruck,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const SidebarPetugas = ({ activePage, onNavigate }) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const menu = [
    { key: 'profil', icon: <FaCalendarAlt />, label: 'Profil' },
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
    <aside className="fixed top-0 left-0 z-20 w-56 h-screen bg-white border-r border-gray-200 flex flex-col justify-between">
          <div>
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
    
            <nav className="px-4 space-y-2 mt-4">
          {menu.map((item) => (
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

export default SidebarPetugas;

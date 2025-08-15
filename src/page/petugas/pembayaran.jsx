import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Pagination from '../../components/Pagination';

const Pembayaran = () => {
  const [penarikanList, setPenarikanList] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get('token');
  const petugasId = Cookies.get('profile') ? JSON.parse(Cookies.get('profile')).id : null;
   const itemsPerPage = 10;
        const [currentPage, setCurrentPage] = useState(1);
        const totalPages = Math.ceil(penarikanList.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const currentData = penarikanList.slice(startIndex, startIndex + itemsPerPage);

  const fetchPenarikan = async () => {
  setLoading(true);
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/penarikan`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Urutkan berdasarkan tanggal terbaru ke terlama
    const sortedData = res.data.data.sort((a, b) => {
      return new Date(b.tgl_penarikan) - new Date(a.tgl_penarikan);
    });

    setPenarikanList(sortedData);
  } catch (err) {
    console.error('Gagal memuat data penarikan:', err);
  } finally {
    setLoading(false);
  }
};


  const handleKonfirmasi = async (id, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/penarikan/${id}/konfirmasi`,
        { status, id_petugas: petugasId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPenarikan();
    } catch (err) {
      console.error('Gagal konfirmasi:', err);
    }
  };

  useEffect(() => {
    fetchPenarikan();
  }, []);

  const formatDate = (isoDate) =>
    isoDate ? new Date(isoDate).toLocaleDateString('id-ID') : '-';

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold">Dashboard Petugas</h2>
      <p className="text-sm text-gray-600">Konfirmasi penarikan saldo nasabah</p>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">No</th>
              <th className="p-3">ID Nasabah</th>
              <th className="p-3">Nominal</th>
              <th className="p-3">Metode</th>
              <th className="p-3">Bank</th>
              <th className="p-3">No Rekening</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-6">
                  Memuat data...
                </td>
              </tr>
            ) : penarikanList.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-6">
                  Tidak ada data penarikan
                </td>
              </tr>
            ) : (
              currentData.map((p, index) => (
                <tr key={p.id} className="border-t">
                  <td className='p-3'>{index + 1}</td>
                  <td className="p-3">TMR/KPS-{p.id_nasabah}</td>
                  <td className="p-3">Rp {p.nominal.toLocaleString()}</td>
                  <td className="p-3 capitalize">{p.metode}</td>
                  <td className="p-3">{p.bank || '-'}</td>
                  <td className="p-3">{p.no_rekening || '-'}</td>
                  <td className="p-3">{formatDate(p.tgl_penarikan)}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        p.status === 'disetujui'
                          ? 'bg-green-100 text-green-700'
                          : p.status === 'ditolak'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    {p.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleKonfirmasi(p.id, 'disetujui')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs"
                        >
                          Terima
                        </button>
                        <button
                          onClick={() => handleKonfirmasi(p.id, 'ditolak')}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                        >
                          Tolak
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
       {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Pembayaran;

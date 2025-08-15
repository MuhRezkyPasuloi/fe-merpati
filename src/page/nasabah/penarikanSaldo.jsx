import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const PenarikanSaldo = () => {
  const [penarikanList, setPenarikanList] = useState([]);
  const [jumlah, setJumlah] = useState('');
  const [metode, setMetode] = useState('transfer');
  const [bank, setBank] = useState('');
  const [rekening, setRekening] = useState('');
  const [saldo, setSaldo] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
const [popupMessage, setPopupMessage] = useState("");
const [showFullTable, setShowFullTable] = useState(false);



  const profile = JSON.parse(Cookies.get('profile'));
  const token = Cookies.get('token');
  const id_nasabah = profile.id;

  const fetchPenarikan = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/penarikan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.data.filter((p) => p.id_nasabah === Number(id_nasabah));
      setPenarikanList(filtered);
    } catch (err) {
      console.error('Gagal mengambil data penarikan:', err);
    }
  };

  const fetchSaldo = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/nasabah/${id_nasabah}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSaldo(res.data.saldo);
    } catch (err) {
      console.error('Gagal mengambil saldo:', err);
    }
  };

  useEffect(() => {
    if (id_nasabah && token) {
      fetchPenarikan();
      fetchSaldo();
    }
  }, []);

  const handleAjukan = async () => {
  if (!id_nasabah) {
    setPopupMessage("Gagal mengambil ID nasabah, silakan login ulang");
    setShowPopup(true);
    return;
  }

  if (!jumlah || jumlah < 10000) {
    setPopupMessage("Jumlah minimal penarikan adalah Rp 10.000");
    setShowPopup(true);
    return;
  }

  if (metode === 'transfer' && (!bank || !rekening)) {
    setPopupMessage("Bank dan nomor rekening wajib diisi untuk metode transfer");
    setShowPopup(true);
    return;
  }

  // =============================
  // CEK TANGGAL PENARIKAN
  // =============================
  const idulFitriDates = {
    2025: new Date(2025, 2, 30),
    2026: new Date(2026, 2, 20),
    2027: new Date(2027, 2, 9),
    2028: new Date(2028, 1, 26),
    2029: new Date(2029, 1, 14)
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const idulFitriDate = idulFitriDates[currentYear];

  if (!idulFitriDate) {
    setPopupMessage("Tanggal Idul Fitri tahun ini belum diatur, silakan hubungi petugas.");
    setShowPopup(true);
    return;
  }

  const startDate = new Date(idulFitriDate);
  startDate.setDate(startDate.getDate() - 3);
  const endDate = new Date(idulFitriDate);
  endDate.setDate(endDate.getDate() - 1);

  if (!(today >= startDate && today <= endDate)) {
    setPopupMessage(
      `❌ Gagal melakukan penarikan!\n\n` +
      `Penarikan hanya diizinkan antara ${startDate.toLocaleDateString('id-ID')} dan ${endDate.toLocaleDateString('id-ID')}.\n` +
      `Silakan hubungi petugas untuk keterangan lebih lanjut.`
    );
    setShowPopup(true);
    return;
  }

 
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/penarikan`,
      {
        id_nasabah: Number(id_nasabah),
        nominal: Number(jumlah),
        metode,
        bank: metode === 'transfer' ? bank : null,
        no_rekening: metode === 'transfer' ? rekening : null,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setPopupMessage("✅ Pengajuan berhasil dikirim");
    setShowPopup(true);

    setJumlah('');
    setMetode('transfer');
    setBank('');
    setRekening('');
    fetchPenarikan();
    fetchSaldo();
  } catch (err) {
    console.error('Gagal mengajukan penarikan:', err);
    setPopupMessage("Terjadi kesalahan saat mengajukan penarikan");
    setShowPopup(true);
  }
};


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-6">
      {/* Form Penarikan */}
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200">
          <h2 className="text-base md:text-sm font-semibold mb-4">Form Penarikan</h2>
          <div className="text-sm text-gray-600 mb-1 md:mb-2">Saldo Tersedia</div>
          <div className="text-lg font-semibold text-green-700 mb-4">
            Rp {saldo.toLocaleString('id-ID')}
          </div>

          <label className="block text-sm font-medium mb-1">Jumlah Penarikan</label>
          <div className="flex items-center border rounded-md px-3 py-2 mb-1">
            <span className="text-gray-500">Rp</span>
            <input
              type="number"
              min="0"
              className="ml-2 w-full outline-none text-sm"
              placeholder="0"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Minimum: Rp 10.000{' '}
            <button className="text-green-600 ml-2" onClick={() => setJumlah(String(saldo))}>
              Tarik Semua
            </button>
          </p>

          <label className="block text-sm font-medium mb-2">Metode Penarikan</label>
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="metode"
                value="transfer"
                checked={metode === 'transfer'}
                onChange={() => setMetode('transfer')}
              />
              <span>Transfer Bank</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="metode"
                value="tunai"
                checked={metode === 'tunai'}
                onChange={() => setMetode('tunai')}
              />
              <span>Tunai</span>
            </label>
          </div>

          {metode === 'transfer' && (
            <>
              <label className="block text-sm font-medium mb-1">Bank</label>
              <select
                className="w-full border rounded-md p-2 text-sm mb-4"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
              >
                <option value="">Pilih Bank</option>
                <option value="BCA">BCA</option>
                <option value="BNI">BNI</option>
                <option value="BRI">BRI</option>
                <option value="DANA">DANA</option>
              </select>

              <label className="block text-sm font-medium mb-1">Nomor Rekening</label>
              <input
                type="text"
                className="w-full border rounded-md p-2 text-sm mb-6"
                placeholder="Nomor rekening bank"
                value={rekening}
                onChange={(e) => setRekening(e.target.value)}
              />
            </>
          )}

          <button
            className="w-full bg-green-700 text-white text-sm font-semibold py-2 rounded-md hover:bg-green-800"
            onClick={handleAjukan}
          >
            Ajukan Penarikan
          </button>
        </div>
      </div>
      {/* Popup Modal */}
{showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
      <h2 className="text-lg font-semibold mb-3">Informasi</h2>
      <p className="text-sm whitespace-pre-line">{popupMessage}</p>
      <button
        onClick={() => setShowPopup(false)}
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
      >
        Tutup
      </button>
    </div>
  </div>
)}

      {/* Riwayat dan Info */}
      <div className="space-y-6">
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200">
          <h2 className="text-sm font-semibold mb-4">Riwayat Penarikan</h2>
          <ul className="space-y-4 text-sm">
            {penarikanList.slice(0, 3).map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Rp {item.nominal.toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(item.tgl_penarikan).toLocaleDateString('id-ID')} • {item.metode.toUpperCase()}
                  </p>
                </div>
                <span
                  className={`text-sm font-medium rounded-full px-2 py-1 text-white ${
                    item.status === 'disetujui'
                      ? 'bg-green-600'
                      : item.status === 'pending'
                      ? 'bg-yellow-500'
                      : item.status === 'ditolak'
                      ? 'bg-red-500'
                      : 'bg-gray-500'
                  }`}
                >
                  {item.status === 'disetujui' ? 'Berhasil' : item.status === 'diproses' ? 'Diproses' : 'Ditolak'}
                </span>
              </li>
            ))}
          </ul>

          {penarikanList.length > 3 && (
            <button
              onClick={() => setShowFullTable(!showFullTable)}
              className="mt-4 text-green-600 text-sm hover:underline"
            >
              {showFullTable ? "Tutup" : "Selengkapnya"}
            </button>
          )}
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg border border-yellow-300">
          <h2 className="text-sm font-semibold mb-2 text-yellow-800">Informasi Penarikan</h2>
          <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
            <li>Minimal penarikan Rp 10.000</li>
            <li>Biaya admin Rp 1.000 per transaksi</li>
            <li>Penarikan hanya diproses pada hari kerja (Senin–Jumat)</li>
            <li>Pastikan data rekening atau e-wallet yang Anda isi sudah benar</li>
          </ul>
        </div>
        
      </div>
      {/* Tabel Riwayat Lengkap */}
  {showFullTable && (
    <div className="md:col-span-3 bg-white p-4 rounded-lg border border-gray-200">
      <h2 className="text-sm font-semibold mb-4">Riwayat Penarikan Lengkap</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">No</th>
              <th className="border px-2 py-1">Nominal</th>
              <th className="border px-2 py-1">Metode</th>
              <th className="border px-2 py-1">Bank</th>
              <th className="border px-2 py-1">No Rekening</th>
              <th className="border px-2 py-1">Tanggal</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {penarikanList.map((item, index) => (
              <tr key={item.id} className="text-center">
                <td className="border px-2 py-1">{index + 1}</td>
                <td className="border px-2 py-1">Rp {item.nominal.toLocaleString()}</td>
                <td className="border px-2 py-1">{item.metode}</td>
                <td className="border px-2 py-1">{item.bank || '-'}</td>
                <td className="border px-2 py-1">{item.no_rekening || '-'}</td>
                <td className="border px-2 py-1">{new Date(item.tgl_penarikan).toLocaleDateString('id-ID')}</td>
                <td className="border px-2 py-1 capitalize">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
    </div>
  );
};

export default PenarikanSaldo;

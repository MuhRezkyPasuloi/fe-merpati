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

  const profile = JSON.parse(Cookies.get('profile'));
  const token = Cookies.get('token');
  const id_nasabah = profile.id;

  const fetchPenarikan = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/penarikan', {
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
      const res = await axios.get(`http://localhost:3000/api/nasabah/${id_nasabah}`, {
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
    if (!id_nasabah) return alert('Gagal mengambil ID nasabah, silakan login ulang');
    if (!jumlah || jumlah < 10000) return alert('Jumlah minimal penarikan adalah Rp 10.000');

    if (metode === 'transfer' && (!bank || !rekening)) {
      return alert('Bank dan nomor rekening wajib diisi untuk metode transfer');
    }

    try {
      await axios.post(
        'http://localhost:3000/api/penarikan',
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
      alert('Pengajuan berhasil dikirim');
      setJumlah('');
      setMetode('transfer');
      setBank('');
      setRekening('');
      fetchPenarikan();
      fetchSaldo();
    } catch (err) {
      console.error('Gagal mengajukan penarikan:', err);
      alert('Terjadi kesalahan saat mengajukan penarikan');
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

      {/* Riwayat dan Info */}
      <div className="space-y-6">
        <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200">
          <h2 className="text-sm font-semibold mb-4">Riwayat Penarikan</h2>
          <ul className="space-y-4 text-sm">
            {penarikanList.map((item) => (
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
                      : item.status === 'ditolak'
                      ? 'bg-red-500'
                      : 'bg-yellow-500'
                  }`}
                >
                  {item.status === 'disetujui' ? 'Berhasil' : item.status === 'diproses' ? 'Diproses' : 'Ditolak'}
                </span>
              </li>
            ))}
          </ul>
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
    </div>
  );
};

export default PenarikanSaldo;

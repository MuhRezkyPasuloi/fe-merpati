import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaFile } from 'react-icons/fa';
import axios from 'axios';
import Pagination from '../../components/Pagination'; 

const ManajemenNasabah = () => {
  const [nasabahList, setNasabahList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNasabah, setSelectedNasabah] = useState(null);
  
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    alamat: '',
    no_hp: '',
    saldo: '',
    foto_url: '',
    fotoFile: null, // 👈 tambahan baru
  });

  const [previewImage, setPreviewImage] = useState(null);

  // State untuk notifikasi popup
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(nasabahList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = nasabahList.slice(startIndex, startIndex + itemsPerPage);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchNasabah = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/nasabah`);
      setNasabahList(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchNasabah();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (nasabah = null) => {
    if (nasabah) {
      setFormData(nasabah);
      setSelectedNasabah(nasabah);
    } else {
      setFormData({ nama: '', username: '', alamat: '', no_hp: '', saldo: '', foto_url: '' });
      setSelectedNasabah(null);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNasabah(null);
    setFormData({ nama: '', username: '', alamat: '', no_hp: '', saldo: '', foto_url: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = new FormData();
        payload.append('nama', formData.nama);
        payload.append('username', formData.username);
        payload.append('alamat', formData.alamat);
        payload.append('no_hp', formData.no_hp);
        payload.append('saldo', formData.saldo);
        if (formData.fotoFile) {
        payload.append('foto', formData.fotoFile);
        }

        if (selectedNasabah) {
        await axios.put(
            `${import.meta.env.VITE_API_URL}/api/nasabah/${selectedNasabah.id}`,
            payload,
            {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            }
        );
        showNotification('Nasabah berhasil diperbarui', 'success');
        } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/nasabah`, payload, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        showNotification('Nasabah berhasil ditambahkan', 'success');
        }

        fetchNasabah();
        closeModal();
    } catch (err) {
        console.error('Submit error:', err);
        showNotification('Gagal Menyimpan Data Nasabah', 'error');
    }
    };


  const handleDelete = async (id) => {
    if (confirm('Yakin ingin menghapus nasabah ini?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/nasabah/${id}`);
        fetchNasabah();
        showNotification('Nasabah berhasil dihapus', 'success');
      } catch (err) {
        console.error('Delete error:', err);
        showNotification('Gagal menghapus nasabah', 'error');
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Popup Notifikasi */}
      {notification.show && (
        <div
          className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 text-white font-medium
            ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {notification.message}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Dashboard Admin</h1>
        <p className="text-sm text-gray-500">Kelola sistem BSU Merpati</p>
      </div>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#111827]">Manajemen Nasabah</h2>
        <button
          onClick={() => openModal()}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <FaPlus /> Tambah Nasabah
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className='p-3 text-left'>NO</th>
              <th className='p-3 text-left'>ID</th>
              <th className="p-3 text-left">NAMA</th>
              <th className="p-3 text-left">ALAMAT</th>
              <th className="p-3 text-left">NO HP</th>
              <th className="p-3 text-left">SALDO</th>
              <th className="p-3 text-left">FOTO</th>
              <th className="p-3 text-left">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((n, index) => (
              <tr key={n.id} className="border-t">
                <td className='p-3'>{index + 1}</td>
                <td className='p-3'>TMR/KPS-{n.id}</td>
                <td className="p-3">{n.nama}</td>
                <td className="p-3">{n.alamat}</td>
                <td className="p-3">{n.no_hp}</td>
                <td className="p-3">Rp {n.saldo.toLocaleString()}</td>
                <td className="p-3">
                  <button
                    onClick={() => setPreviewImage(n.foto_url)}
                    className="text-blue-600 hover:underline"
                  >
                    <FaFile />
                  </button>
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    className="p-2 border rounded text-gray-700 hover:bg-gray-100"
                    onClick={() => openModal(n)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="p-2 border rounded text-red-500 border-red-500 hover:bg-red-50"
                    onClick={() => handleDelete(n.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Pagination */}
      
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          // onPageChange={(page) => setCurrentPage(page)}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modal Form */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md">
      <h3 className="text-lg font-semibold mb-4">
        {selectedNasabah ? 'Edit Nasabah' : 'Tambah Nasabah'}
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          // ✅ Validasi panjang username
          if (formData.username.length > 4) {
            showNotification(
              'Username harus terdiri lebih dari 4 karakter',
              'error'
            );
            return; // hentikan submit
          }

          // ✅ Lanjutkan proses submit jika lolos validasi
          handleSubmit(e);
        }}
        className="space-y-4"
      >
        <input
          type="text"
          name="nama"
          placeholder="Nama"
          value={formData.nama}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username (lebih dari 4 karakter)"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="alamat"
          placeholder="Alamat"
          value={formData.alamat}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="no_hp"
          placeholder="No HP"
          value={formData.no_hp}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="saldo"
          placeholder="Saldo"
          value={formData.saldo}
          onChange={handleInputChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setPreviewImage(URL.createObjectURL(file));
              setFormData((prev) => ({ ...prev, fotoFile: file }));
            }
          }}
          className="w-full border p-2 rounded"
          required
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      {/* Gambar Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="Preview" className="max-w-sm rounded shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default ManajemenNasabah;
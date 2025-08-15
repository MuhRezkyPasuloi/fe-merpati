import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Cookie from "js-cookie";

const bulanOptions = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const tahunOptions = (() => {
  const tahunSekarang = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => tahunSekarang - i);
})();

const LaporanTahunan = () => {
  const [tahun, setTahun] = useState(new Date().getFullYear());
  const [laporan, setLaporan] = useState([]);
  const token = Cookie.get("token");

  const fetchLaporan = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/laporan/tahunan/?tahun=${tahun}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLaporan(res.data.data);
    } catch (err) {
      console.error("Gagal mengambil laporan tahunan:", err);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, [tahun]);

  // Fungsi buat export PDF panjang jadi multi halaman
  const handleDownload = () => {
    if (!laporan.length) {
      alert("Tidak ada data untuk diunduh");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(16);
    doc.text(`Laporan Tahunan Tabungan Nasabah - ${tahun}`, 14, 15);

    let allRows = [];

    // Gabungkan semua bulan ke dalam satu array untuk PDF
    groupByMonth(laporan).forEach((group) => {
      // Tambahkan judul bulan sebagai baris kosong di tabel
      allRows.push([
        { content: `${group.namaBulan} ${group.tahun}`, colSpan: 6, styles: { halign: "center", fillColor: [220, 220, 220] } }
      ]);

      // Tambahkan data per bulan
      group.records.forEach((item) => {
        allRows.push([
          item.no,
          item.nama_nasabah,
          item.jenis_sampah,
          item.tanggal,
          item.berat,
          `Rp ${item.pendapatan.toLocaleString("id-ID")}`
        ]);
      });
    });

    autoTable(doc, {
      head: [["No", "Nama Nasabah", "Jenis Sampah", "Tanggal Menabung", "Berat (kg)", "Pendapatan"]],
      body: allRows,
      startY: 25,
      styles: { fontSize: 10, cellPadding: 2 },
      headStyles: { fillColor: [52, 152, 219] },
      pageBreak: "auto",
    });

    doc.save(`Laporan_Tahunan_${tahun}.pdf`);
  };

  const groupByMonth = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const dateObj = new Date(item.tanggal_menabung);
      const monthIndex = dateObj.getMonth();
      const key = `${monthIndex}-${dateObj.getFullYear()}`;
      const bulanNama = bulanOptions[monthIndex];

      if (!grouped[key]) {
        grouped[key] = {
          namaBulan: bulanNama,
          tahun: dateObj.getFullYear(),
          monthIndex,
          records: []
        };
      }

      grouped[key].records.push({
        nama_nasabah: item.nama_nasabah,
        jenis_sampah: item.jenis_sampah,
        tanggal: dateObj.toLocaleDateString("id-ID"),
        berat: item.total_berat,
        pendapatan: item.total_nominal
      });
    });

    // Nomor urut per bulan
    for (const key in grouped) {
      grouped[key].records = grouped[key].records.map((r, idx) => ({
        ...r,
        no: idx + 1
      }));
    }

    return Object.values(grouped).sort((a, b) => a.monthIndex - b.monthIndex);
  };

  const groupedLaporan = groupByMonth(laporan);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-xl font-bold">Laporan Tahunan Tabungan Nasabah</h1>
        <div className="flex gap-2">
          <select
            value={tahun}
            onChange={(e) => setTahun(Number(e.target.value))}
            className="border rounded-md px-3 py-2 text-sm"
          >
            {tahunOptions.map((th) => (
              <option key={th} value={th}>
                {th}
              </option>
            ))}
          </select>
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
          >
            Download Laporan
          </button>
        </div>
      </div>

      <div id="laporan-pdf" className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
        {groupedLaporan.length > 0 ? (
          <table className="min-w-full text-sm text-left border border-collapse">
            <thead className="bg-gray-100 border">
              <tr>
                <th className="px-4 py-2 border">No</th>
                <th className="px-4 py-2 border">Nama Nasabah</th>
                <th className="px-4 py-2 border">Jenis Sampah</th>
                <th className="px-4 py-2 border">Tanggal Menabung</th>
                <th className="px-4 py-2 border">Berat (kg)</th>
                <th className="px-4 py-2 border">Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {groupedLaporan.map((group, i) => (
                <React.Fragment key={i}>
                  <tr className="bg-gray-200">
                    <td colSpan="6" className="text-center font-semibold py-2 border">
                      {group.namaBulan} {group.tahun}
                    </td>
                  </tr>
                  {group.records.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2 border">{item.no}</td>
                      <td className="px-4 py-2 border capitalize">{item.nama_nasabah}</td>
                      <td className="px-4 py-2 border capitalize">{item.jenis_sampah}</td>
                      <td className="px-4 py-2 border">{item.tanggal}</td>
                      <td className="px-4 py-2 border">{item.berat}</td>
                      <td className="px-4 py-2 border">Rp {item.pendapatan.toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-6 text-gray-500 text-sm">
            Tidak ada data laporan untuk tahun ini.
          </p>
        )}
      </div>
    </div>
  );
};

export default LaporanTahunan;

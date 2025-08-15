// utils/exportLaporanPDF.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Export laporan dalam bentuk PDF
 * @param {Array} data - Data laporan, format array of object
 * @param {string} title - Judul laporan di PDF
 */
export const exportLaporanPDF = (data, title = "Laporan") => {
  const doc = new jsPDF({
    orientation: "portrait", // bisa diganti "landscape"
    unit: "mm",
    format: "a4",
  });

  // Judul
  doc.setFontSize(16);
  doc.text(title, 14, 15);

  // Header tabel (ambil key dari objek pertama)
  const headers = Object.keys(data[0] || {}).map((key) =>
    key.replace(/_/g, " ").toUpperCase()
  );

  // Isi tabel
  const body = data.map((row) => Object.values(row));

  // AutoTable untuk buat tabel panjang dengan page break otomatis
  autoTable(doc, {
    head: [headers],
    body: body,
    startY: 25,
    styles: {
      fontSize: 10,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [52, 152, 219],
    },
    margin: { top: 25 },
    pageBreak: "auto", // biar otomatis pindah halaman
  });

  // Simpan file
  doc.save(`${title}.pdf`);
};

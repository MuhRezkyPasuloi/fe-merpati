// src/pages/LandingPage.jsx
import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Menu, X } from 'lucide-react';
import recycle from '../assets/tl.png';
import { FaRecycle, FaLeaf, FaMoneyBillWave, FaTruck, FaBalanceScale, FaCreditCard, FaChartBar, FaUsers, FaShieldAlt, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, } from 'react-icons/fa';

const LandingPage = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const layanan = [
    // { icon: <FaTruck />, title: 'Penjualan Sampah', desc: 'Layanan penj langsung ke rumah Anda dengan jadwal fleksibel' },
    { icon: <FaBalanceScale />, title: 'Penimbangan Digital', desc: 'Sistem penimbangan akurat & transparan untuk tiap jenis sampah' },
    // { icon: <FaCreditCard />, title: 'Pembayaran Instan', desc: 'Pembayaran langsung ke rekening atau e-wallet setelah penimbangan' },
    { icon: <FaChartBar />, title: 'Laporan & Analitik', desc: 'Pantau kontribusi dan penghasilan Anda lewat dashboard lengkap' },
    { icon: <FaUsers />, title: 'Komunitas Hijau', desc: 'Gabung komunitas peduli lingkungan dan ikut program menarik' },
    { icon: <FaShieldAlt />, title: 'Keamanan Terjamin', desc: 'Sertifikasi aman dan jaminan keamanan data pengguna' },
  ];

  const statistik = [
    { label: 'Nasabah Aktif', value: '50,000+' },
    { label: 'Sampah Tertarik', value: '2,500 Ton' },
    { label: 'Rupiah Dibelanjakan', value: '15 Miliar' },
    { label: 'CO₂ Berkurang', value: '500 Ton' },
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="font-sans">
      
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <FaRecycle />
          <span className="font-semibold text-green-600">BSU Merpati</span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#beranda" className="hover:text-green-600">Beranda</a>
          <a href="#tentang" className="hover:text-green-600">Tentang</a>
          <a href="#layanan" className="hover:text-green-600">Layanan</a>
          <a href="#kontak" className="hover:text-green-600">Kontak</a>
        </nav>

        {/* Login button */}
        <a
          href="/login"
          className="hidden md:block px-4 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-white hover:text-green-500 hover:border-green-600 hover:border"
        >
          Login
        </a>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-green-600 focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-3 text-sm shadow-md">
          <a href="#beranda" className="block text-gray-700 hover:text-green-600">Beranda</a>
          <a href="#tentang" className="block text-gray-700 hover:text-green-600">Tentang</a>
          <a href="#layanan" className="block text-gray-700 hover:text-green-600">Layanan</a>
          <a href="#kontak" className="block text-gray-700 hover:text-green-600">Kontak</a>
          <a
            href="/login"
            className="inline-block px-4 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-white hover:text-green-500 hover:border-green-600 hover:border"
          >
            Login
          </a>
        </div>
      )}
    </header>

      {/* Hero Section */}
      <section id="beranda" className="bg-green-50 py-20 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between gap-10">
        <div data-aos="fade-right" className="max-w-xl">
          <h1 className="text-4xl font-bold leading-snug">
            Ubah Sampah <br /> Menjadi <span className="text-green-600">Berkah</span>
          </h1>
          <p className="text-sm text-gray-700 mt-4">
            Bergabunglah dengan gerakan bank sampah digital pertama di Indonesia. Daur ulang sampah dan dapatkan keuntungan sekaligus menjaga lingkungan.
          </p>
          <div className="flex gap-4 mt-6">
            <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">Mulai Sekarang</button>
            <button className="border border-gray-400 text-sm px-4 py-2 rounded hover:bg-gray-100">Pelajari Lebih Lanjut</button>
          </div>
          <div className="flex gap-6 mt-10">
            <div className="flex flex-col items-center text-sm">
              <FaRecycle className="text-2xl text-green-500" />
              <span>Daur Ulang</span>
            </div>
            <div className="flex flex-col items-center text-sm">
              <FaLeaf className="text-2xl text-green-500" />
              <span>Eco-Friendly</span>
            </div>
            <div className="flex flex-col items-center text-sm">
              <FaMoneyBillWave className="text-2xl text-green-500" />
              <span>Menguntungkan</span>
            </div>
          </div>
        </div>
        <div data-aos="fade-left">
          <div className="transition-transform duration-500 transform rotate-[8deg] hover:rotate-0 shadow-xl rounded-lg overflow-hidden bg-green-500 px-6 py-4 w-80">
            <p className="text-sm font-semibold text-white">Bank Sampah Digital</p>
            <p className="text-xs text-white mt-2">Saldo Saat Ini</p>
            <p className="text-xl font-bold text-white">Rp 250.000</p>
            <p className="text-xs text-white mt-4">Total Sampah</p>
            <p className="text-sm font-semibold text-white">123 kg</p>
            <p className="text-xs text-white mt-4">Kontribusi CO₂</p>
            <p className="text-sm font-semibold text-white">+48 kg</p>
          </div>
        </div>
      </section>

          

      {/* Layanan Kami */}
      <section className="py-20 px-6 md:px-20 bg-white" id="layanan">
        <h2 className="text-xl font-bold text-center mb-4">Layanan Kami</h2>
        <p className="text-center text-gray-600 max-w-xl mx-auto mb-10">
          Kami menyediakan berbagai layanan bank sampah digital yang memudahkan Anda untuk berkontribusi menjaga lingkungan sambil mendapatkan keuntungan
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {layanan.map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition flex flex-col items-center"
              data-aos="fade-up"
            >
              <div className="text-2xl text-green-500 mb-3 flex justify-center items-center">{item.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-20 px-6 md:px-20 bg-green-50" id="tentang">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Tentang BSU Merpati</h2>
            <p className="text-gray-700 leading-relaxed text-sm mb-4">
              BSU Merpati adalah platform bank sampah digital pertama di Indonesia yang menggabungkan teknologi modern dengan misi pelestarian lingkungan.
              <br /><br />
              Kami percaya bahwa setiap orang dapat berkontribusi untuk menjaga kelestarian bumi melalui pengelolaan sampah yang bijak. Dengan sistem digital yang mudah dan transparan, kami membantu masyarakat mengubah sampah menjadi sumber penghasilan sambil mengurangi dampak negatif terhadap lingkungan.
            </p>
          </div>
          <img
            src={recycle}
            alt="tree"
            className="rounded-lg"
            data-aos="fade-left"
          />
        </div>

        {/* Statistik */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {statistik.map((item, i) => (
            <div key={i} className="bg-white text-center p-6 rounded-lg shadow" data-aos="zoom-in">
              <p className="text-lg font-bold text-green-600">{item.value}</p>
              <p className="text-sm text-gray-700 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hubungi Kami */}
      <section className="py-20 px-6 md:px-20 bg-white" id="kontak">
        <h2 className="text-xl font-bold text-center mb-4">Hubungi Kami</h2>
        <p className="text-center text-sm text-gray-600 mb-8">
          Ada pertanyaan atau ingin bergabung? Jangan ragu untuk menghubungi tim kami.
        </p>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3"><FaEnvelope className="text-green-500 mt-1" /><div><p className="font-semibold">Email</p><p>info@hijaucycle.com</p></div></div>
            <div className="flex items-start gap-3"><FaPhone className="text-green-500 mt-1" /><div><p className="font-semibold">Telepon</p><p>+62 123 1234 5678</p></div></div>
            <div className="flex items-start gap-3"><FaMapMarkerAlt className="text-green-500 mt-1" /><div><p className="font-semibold">Alamat</p><p>Jl. Manggis IV, No.8 Blok JB, Kapasa, Tamalanrea, Makassar</p></div></div>
            <div className="flex items-start gap-3"><FaClock className="text-green-500 mt-1" /><div><p className="font-semibold">Jam Operasional</p><p>Senin - Jumat 08:00 - 17:00</p></div></div>
          </div>
          <form className="space-y-4 bg-gray-50 p-6 rounded-lg">
            <input type="text" placeholder="Nama Lengkap" className="w-full border px-4 py-2 rounded text-sm" />
            <input type="email" placeholder="Email" className="w-full border px-4 py-2 rounded text-sm" />
            <input type="text" placeholder="No. Telepon" className="w-full border px-4 py-2 rounded text-sm" />
            <input type="text" placeholder="Subjek" className="w-full border px-4 py-2 rounded text-sm" />
            <textarea placeholder="Pesan" rows="4" className="w-full border px-4 py-2 rounded text-sm"></textarea>
            <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">Kirim Pesan</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-6 md:px-20 text-sm">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-white font-bold mb-2">BSU Merpati</h3>
            <p>Platform bank sampah digital yang bertujuan membantu mengelola sampah jadi berkah untuk masa depan yang lebih hijau.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Layanan</h4>
            <ul className="space-y-1">
              {/* <li>Penjemputan Sampah</li> */}
              <li>Penimbangan Digital</li>
              {/* <li>Pembayaran Instan</li> */}
              <li>Laporan & Analitik</li>
              <li>Komunitas Hijau</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Perusahaan</h4>
            <ul className="space-y-1">
              <li>Tentang Kami</li>
              <li>Tim</li>
              <li>Karir</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Kontak</h4>
            <ul className="space-y-1">
              <li>info@merpati.com</li>
              <li>+62 123 1234 5678</li>
              <li>Jl. Manggis IV, No.8 Blok JB, Kapasa, Tamalanrea, Makassar</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 text-xs text-gray-500">© 2024 BSU Merpati. Semua hak dilindungi.</div>
      </footer>
    </div>
  );
};

export default LandingPage;
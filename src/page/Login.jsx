import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye } from 'react-icons/fa';

import Logo from '../assets/logo.png';
import Background from '../assets/bgmount3.png';
import Icon1 from '../assets/mount.png';

const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", input);
      const { message, token, role, profile } = res.data;

      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });

      Cookies.set('token', token, { expires: 1 });
      Cookies.set('role', role, { expires: 1 });
      Cookies.set('username', input.username, { expires: 1 });
      Cookies.set('profile', JSON.stringify(profile), { expires: 1 });
      Cookies.set('id', profile.id);

      setTimeout(() => {
        if (['admin', 'petugas', 'nasabah'].includes(role)) {
          navigate(`/dashboard/${role}`);
        } else {
          toast.error("Role tidak dikenali");
        }
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login gagal", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen font-sans">
      {/* Kiri */}
      <div className="flex-1 bg-gradient-to-br from-yellow-400 to-orange-500 relative flex flex-col justify-center items-center">
        <img src={Logo} alt="Logo" className="w-60 z-10 mb-5" />
        <h1 className="text-white font-bold text-2xl z-10">GaPakeRem Adventure</h1>
        <img
          src={Background}
          alt="Background"
          className="absolute bottom-0 left-0 w-full h-1/2 object-cover z-0"
        />
      </div>

      {/* Kanan */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white relative">
        <form onSubmit={handleLogin} className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-semibold text-[#FFB000]">
              Selamat Datang, Petualang!
            </h1>
            <p className="text-gray-500 mt-2">
              Login untuk memulai perjalanan ke puncak impian Anda.
            </p>
          </div>

          {/* Username */}
          <div className="mb-5">
            <label className="block text-gray-600 mb-1">Username</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              value={input.username}
              disabled={loading}
              required
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password */}
          <div className="mb-8">
            <label className="block text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                value={input.password}
                disabled={loading}
                required
                className="w-full p-3 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                <FaEye />
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF5A00] text-white font-bold py-3 rounded-full hover:bg-orange-600 transition"
          >
            Login
          </button>

          {/* Links */}
          <div className="flex justify-between text-sm text-[#FF5A00] mt-4 font-semibold">
            <Link to="#">Lupa Password?</Link>
            <Link to="/register">Belum Punya Akun?</Link>
          </div>

          {/* Spinner */}
          {loading && (
            <div className="flex justify-center items-center mt-10">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Footer icons */}
          <div className="flex justify-center gap-5 mt-20">
            <img src={Icon1} alt="icon" className="h-10" />
            <img src={Icon1} alt="icon" className="h-10" />
            <img src={Icon1} alt="icon" className="h-10" />
          </div>
        </form>
      </div>

      <ToastContainer className="absolute top-5 right-5" />
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import recycle from '../assets/tl (2).png';


const Login = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, input);
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
      <div className="flex-1 bg-gradient-to-br from-green-500 to-green-700 relative flex flex-col justify-center items-center">
        <img src={recycle} alt="Logo" className="w-40 z-10 mb-4" />
        <h1 className="text-white font-bold text-2xl z-10">Bank Sampah Merpati</h1>
        <p className="text-green-100 z-10 mt-2">Daur ulang untuk masa depan yang lebih hijau</p>
      </div>

      {/* Kanan */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white relative">
        <form onSubmit={handleLogin} className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-semibold text-green-600">
              Selamat Datang!
            </h1>
            <p className="text-gray-500 mt-2">
              Masuk untuk mengelola sampah dan tabungan Anda
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
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
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
                className="w-full p-3 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-3 rounded-full hover:bg-green-700 transition"
          >
            Login
          </button>

         
          <div className="flex justify-between text-sm text-green-600 mt-4 font-semibold">
            <button onClick={handleForgotPassword}>Lupa Password?</button>
            
          </div>

          {/* Spinner */}
          {loading && (
            <div className="flex justify-center items-center mt-10">
              <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </form>
      </div>

      <ToastContainer className="absolute top-5 right-5" />
    </div>
  );
};

export default Login;

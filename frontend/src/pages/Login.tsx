import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import buildingImage from "../assets/images/logo-bpkad.png";
import logoBpkad from "../assets/images/bpkad-building.png";
import userIcon from "../assets/icons/profile.svg";
import lockIcon from "../assets/icons/kunci.svg";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await login(username, password);
      // Simpan token di localStorage untuk sesi
      localStorage.setItem("authToken", data.token);

      // Arahkan ke dasbor setelah berhasil login
      navigate("/dashboarddokumen");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-[#F6F6F6] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden fixed inset-0">
      {/* LEFT SECTION - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-8 lg:py-0 order-2 lg:order-1 animate-[slideInLeft_0.6s_ease-out]">
        <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-2xl shadow-orange-500/10 px-6 sm:px-12 py-10 sm:py-14 border border-orange-100/50 backdrop-blur-sm animate-[fadeIn_0.8s_ease-out_0.2s_both]">
          {/* LOGO ONLY (TEKS DIHAPUS) */}
          <div className="flex flex-col items-center mb-10 animate-[scaleIn_0.5s_ease-out_0.4s_both]">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl blur-2xl opacity-20 animate-pulse"></div>
              <img
                src={logoBpkad}
                alt="BPKAD Logo"
                className="relative h-20 sm:h-24 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* ERROR MESSAGE */}
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* USERNAME INPUT */}
            <div className="animate-[slideUp_0.5s_ease-out_0.5s_both]">
              <label className="block text-xs font-bold text-gray-700 mb-2.5 tracking-wide uppercase">
                Nama Pengguna
              </label>
              <div className="relative flex items-center bg-white border border-gray-300 rounded-xl px-4 py-3.5 transition-all duration-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20">
                <img
                  src={userIcon}
                  className="w-5 h-5 mr-3 opacity-40"
                  alt="User"
                />
                <input
                  type="text"
                  placeholder="Masukkan NIP atau username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={50}
                  className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 font-medium"
                  required
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="animate-[slideUp_0.5s_ease-out_0.6s_both]">
              <label className="block text-xs font-bold text-gray-700 mb-2.5 tracking-wide uppercase">
                Kata Sandi
              </label>
              <div className="relative flex items-center bg-white border border-gray-300 rounded-xl px-4 py-3.5 transition-all duration-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/20">
                <img
                  src={lockIcon}
                  className="w-5 h-5 mr-3 opacity-40"
                  alt="Lock"
                />
                <input
                  type="password"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={100}
                  className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 font-medium"
                  required
                />
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center animate-[slideUp_0.5s_ease-out_0.7s_both]">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-2 border-gray-300 text-orange-500 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer transition-all hover:border-orange-400"
              />
              <label
                htmlFor="remember"
                className="ml-3 text-sm text-gray-600 select-none cursor-pointer hover:text-gray-800 transition-colors font-medium"
              >
                Tetap masuk di perangkat ini
              </label>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-[length:200%_auto] hover:bg-[position:100%] text-white font-bold text-sm tracking-wider py-4 rounded-xl transition-all duration-500 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed animate-[slideUp_0.5s_ease-out_0.8s_both] overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? "Sedang masuk..." : "MASUK"}
              </span>
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 text-center animate-[fadeIn_0.5s_ease-out_1s_both]">
            <p className="text-xs text-gray-500"></p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - HERO */}
      <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-screen order-1 lg:order-2 overflow-hidden">
        <div
          className="absolute inset-0 bg-no-repeat animate-[zoomIn_1.2s_ease-out]"
          style={{
            backgroundImage: `url(${buildingImage})`,
            backgroundSize: "100% auto",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "100% 90%",
          }}
        />

        {/* Gradient Overlay with Animation */}
        <div
          className="
  absolute inset-0
  bg-gradient-to-t
  from-[#FF5700]/60
  via-[#FF5700]/10
  to-transparent
"
        />
        {/* Animated Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[650px] lg:h-[650px] border-[3px] border-white/20 rotate-45 rounded-[60px] animate-[spin_30s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] lg:w-[550px] lg:h-[550px] border-[2px] border-white/10 rotate-45 rounded-[50px] animate-[spin_25s_linear_infinite_reverse]" />
        </div>

        {/* Info Card */}
        <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-4 right-4 sm:left-8 sm:right-8 lg:left-16 lg:right-16 max-w-xl mx-auto lg:mx-0 animate-[slideInRight_0.8s_ease-out_0.5s_both]">
          <div className="bg-gradient-to-br from-black/40 via-black/20 to-black/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] group">
            {/* Badge */}
            <div className="flex items-center text-xs font-bold mb-4 tracking-widest">
              <span className="relative flex h-3 w-3 mr-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                LAYANAN AKUNTANSI DIGITAL
              </span>
            </div>

            {/* Title with Gradient */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 group-hover:scale-[1.02] transition-transform duration-500">
              <span className="bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent animate-[gradient_3s_ease_infinite] bg-[length:200%_auto]">
                Manajemen Dokumen Keuangan
                <br />
                yang Efisien dan
                <br />
                Terintegrasi
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
              Sistem terintegrasi untuk pengelolaan data akuntansi yang aman dan
              transparan di seluruh unit kerja.
            </p>

            {/* Decorative Line */}
            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-orange-500 via-orange-400 to-transparent rounded-full group-hover:w-32 transition-all duration-500"></div>
          </div>
        </div>

        {/* Floating Particles Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes zoomIn {
          from {
            transform: scale(1.1);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) translateX(20px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

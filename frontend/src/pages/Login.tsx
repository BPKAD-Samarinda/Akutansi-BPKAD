import { useState } from "react";
import { useNavigate } from "react-router-dom";
import buildingImage from "../assets/images/logo-bpkad.png";
import logoBpkad from "../assets/images/bpkad-building.png";
import userIcon from "../assets/icons/profile.svg";
import lockIcon from "../assets/icons/kunci.svg";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi login - redirect ke dashboard
    navigate("/dashboarddokumen");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F6F6F6] font-['Poppins']">
      {/* LEFT SECTION - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-8 lg:py-0 order-2 lg:order-1">
        <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-lg px-6 sm:px-10 py-8 sm:py-12">
          {/* LOGO BPKAD WITH BADGE AND TEXT */}
          <div className="flex flex-col items-center mb-8 sm:mb-10">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={logoBpkad}
                alt="BPKAD Logo"
                className="h-16 sm:h-20 object-contain"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                BPKAD
              </h1>
              <p className="text-sm sm:text-base text-gray-600 font-medium">
                Kota Samarinda
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            {/* NAMA PENGGUNA INPUT */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-2 tracking-wide">
                NAMA PENGGUNA
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-orange-400 transition">
                <img
                  src={userIcon}
                  className="w-5 h-5 mr-3 opacity-40"
                  alt="User"
                />
                <input
                  type="text"
                  placeholder="NIP atau Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* KATA SANDI INPUT */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-700 mb-2 tracking-wide">
                KATA SANDI
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus-within:border-orange-400 transition">
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
                  className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* CHECKBOX - REMEMBER ME */}
            <div className="flex items-center mb-7">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-sm text-gray-600 select-none cursor-pointer"
              >
                Ingat Saya Di Perangkat Ini
              </label>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm tracking-wider py-3.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              MASUK
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SECTION - HERO IMAGE & INFO */}
      <div className="w-full lg:w-1/2 relative min-h-[400px] lg:min-h-screen order-1 lg:order-2">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${buildingImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "scroll",
          }}
        />

        {/* Overlay dengan transparansi */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-orange-600/40 to-orange-700/50" />

        {/* Dekorasi geometris - Responsif */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] border-[40px] sm:border-[60px] lg:border-[80px] border-white/10 rotate-45 rounded-3xl" />
        </div>

        {/* Info Card - Responsif */}
        <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-4 right-4 sm:left-8 sm:right-8 lg:left-16 lg:right-16 max-w-xl mx-auto lg:mx-0">
          <div className="bg-black/50 backdrop-blur-md rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
            {/* Badge */}
            <div className="flex items-center text-xs font-semibold mb-3 sm:mb-4 tracking-wider">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full mr-2.5 animate-pulse" />
              LAYANAN AKUNTANSI DIGITAL
            </div>

            {/* Heading - Responsif */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-3 sm:mb-4">
              Efisiensi Manajemen
              <br />
              Dokumen Keuangan
              <br />
              Terintegrasi.
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
              Sistem terpadu untuk koordinasi penggunaan data akuntansi yang
              aman dan transparan di seluruh departemen perusahaan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
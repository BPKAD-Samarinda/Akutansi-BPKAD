import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoBpkad from "../assets/images/bpkad-building.png";
import userIcon from "../assets/icons/profile.svg";
import lockIcon from "../assets/icons/kunci.svg";
import AuthHero from "../components/layout/AuthHero";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi loading
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    navigate("/dashboarddokumen");
  };

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-[#F6F6F6] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden fixed inset-0">
      {/* LEFT SECTION - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-8 lg:py-0 order-2 lg:order-1 animate-slideInLeft">
        <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-2xl shadow-orange-500/10 px-6 sm:px-12 py-10 sm:py-14 border border-orange-100/50 backdrop-blur-sm animate-fadeIn animate-delay-200">
          {/* LOGO ONLY (TEKS DIHAPUS) */}
          <div className="flex flex-col items-center mb-10 animate-scaleIn animate-delay-400">
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
            {/* USERNAME INPUT */}
            <div className="animate-slideUp animate-delay-500">
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
            <div className="animate-slideUp animate-delay-500">
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
                  maxLength={15}
                  className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 font-medium"
                  required
                />
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="flex items-center animate-slideUp">
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
              className="relative w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-[length:200%_auto] hover:bg-[position:100%] text-white font-bold text-sm tracking-wider py-4 rounded-xl transition-all duration-500 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed animate-slideUp overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? "Sedang masuk..." : "MASUK"}
              </span>
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 text-center animate-fadeIn animate-delay-400">
            <p className="text-xs text-gray-500"></p>
          </div>
        </div>
      </div>

      <AuthHero />
    </div>
  );
}
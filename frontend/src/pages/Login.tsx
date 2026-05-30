// frontend/src/pages/Login.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import AuthHero from "../components/layout/AuthHero";
import LoginForm from "../components/layout/LoginForm";
import { sanitizeCredentialInput, getUser } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<{ username: string; role: string } | null>(null);

  const handleEnterDashboard = () => {
    setShowWelcome(false);
    navigate("/dashboard");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const safeUsername = sanitizeCredentialInput(username, 50);
    const safePassword = password.slice(0, 100);

    if (!safeUsername || !safePassword) {
      setError("Nama pengguna dan kata sandi wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await login(safeUsername, safePassword);
      localStorage.setItem("authToken", data.token);
      sessionStorage.removeItem("authToken");
      
      const decoded = getUser();
      setLoggedInUser(decoded);
      setShowWelcome(true);
    } catch (err: Error | unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 relative">
      <LoginForm
        username={username}
        password={password}
        isLoading={isLoading}
        error={error}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
      <AuthHero />

      {/* Welcome Notification Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-950/55 animate-[welcomeBgFade_0.4s_ease-out] pointer-events-auto">
          <style>{`
            @keyframes welcomeBgFade {
              from { backdrop-filter: blur(0px); background-color: rgba(0, 0, 0, 0); }
              to { backdrop-filter: blur(4px); background-color: rgba(2, 6, 23, 0.55); }
            }
            @keyframes welcomeScaleIn {
              from { transform: scale(0.9) translateY(10px); opacity: 0; }
              to { transform: scale(1) translateY(0); opacity: 1; }
            }
            @keyframes welcomePulse {
              0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(16,185,129,0.2); }
              50% { transform: scale(1.05); box-shadow: 0 0 35px rgba(16,185,129,0.4); }
            }
          `}</style>
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800/80 text-center animate-[welcomeScaleIn_0.5s_cubic-bezier(0.16,1,0.3,1)_both] group overflow-hidden">
            {/* Top decorative gradient line */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-400" />
            
            {/* Pulsing Access Lock Icon */}
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 animate-[welcomePulse_2s_infinite] relative">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Status Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 border border-emerald-100 dark:border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Akses Berhasil Diberikan
            </span>

            {/* Title & Description */}
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-tight mb-2">
              Selamat Datang Kembali!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[280px] mx-auto mb-6">
              Halo <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{loggedInUser?.username}</span>, Anda berhasil masuk ke portal sebagai <span className="font-bold text-slate-700 dark:text-slate-200">{loggedInUser?.role}</span>.
            </p>

            {/* Action CTA Button */}
            <button
              onClick={handleEnterDashboard}
              className="px-10 h-10 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-500 text-white font-bold text-xs tracking-wider rounded-xl transition-all duration-300 hover:shadow-[0_6px_20px_rgba(16,185,129,0.25)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer pointer-events-auto mx-auto block"
            >
              Masuk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// frontend/src/components/layout/LoginForm.tsx
import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import userIcon from "../../assets/icons/profile.svg";
import lockIcon from "../../assets/icons/kunci.svg";
import bpkadBuildingHitam from "../../assets/images/bpkad-building-hitam.webp";

type LoginFormProps = {
  username: string;
  password: string;
  isLoading: boolean;
  error: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function LoginForm({
  username,
  password,
  isLoading,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-8 lg:py-0 order-1 animate-[slideInLeft_0.6s_ease-out]">
      <div className="w-full max-w-[410px] animate-[fadeIn_0.8s_ease-out_0.2s_both]">
        <div className="w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-6 sm:px-9 py-8 sm:py-10 border border-slate-100 transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-orange-500/20">
          <div className="flex flex-col items-center mb-8 animate-[scaleIn_0.5s_ease-out_0.4s_both]">
            <div className="relative mb-4 cursor-default">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl blur-xl opacity-20"></div>
              <img
                src={bpkadBuildingHitam}
                alt="BPKAD Logo"
                className="relative h-16 sm:h-20 object-contain drop-shadow-xl"
              />
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <div
                className="bg-red-550 border border-red-200 text-red-600 px-4 py-3 rounded-xl relative text-sm font-medium animate-[fadeIn_0.3s_ease-in-out]"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <div className="animate-[slideUp_0.5s_ease-out_0.5s_both]">
              <label className="block text-xs font-bold text-slate-700 mb-2.5 tracking-wider uppercase">
                Nama Pengguna
              </label>
              <div className="relative flex items-center h-12 bg-slate-50/50 border border-slate-200 rounded-xl px-4 transition-all duration-300 hover:bg-white hover:border-orange-400/30 hover:shadow-[0_0_10px_rgba(249,115,22,0.05)] focus-within:bg-white focus-within:border-orange-400/70 focus-within:ring-2 focus-within:ring-orange-500/5 focus-within:shadow-[0_0_12px_rgba(249,115,22,0.08)]">
                <img src={userIcon} className="w-3.5 h-3.5 mr-3 opacity-40" alt="User" />
                <input
                  type="text"
                  placeholder="Masukkan NIP atau nama pengguna"
                  value={username}
                  onChange={(e) => onUsernameChange(e.target.value)}
                  maxLength={50}
                  className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 font-medium"
                  required
                />
              </div>
            </div>

            <div className="animate-[slideUp_0.5s_ease-out_0.6s_both]">
              <label className="block text-xs font-bold text-slate-700 mb-2.5 tracking-wider uppercase">
                Kata Sandi
              </label>
              <div className="relative flex items-center h-12 bg-slate-50/50 border border-slate-200 rounded-xl px-4 transition-all duration-300 hover:bg-white hover:border-orange-400/30 hover:shadow-[0_0_10px_rgba(249,115,22,0.05)] focus-within:bg-white focus-within:border-orange-400/70 focus-within:ring-2 focus-within:ring-orange-500/5 focus-within:shadow-[0_0_12px_rgba(249,115,22,0.08)]">
                <img src={lockIcon} className="w-3.5 h-3.5 mr-3 opacity-40" alt="Lock" />
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  maxLength={100}
                  className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 font-medium pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  aria-label={isPasswordVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  className="absolute right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors hover:text-orange-600"
                >
                  {isPasswordVisible ? (
                    <IoMdEyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <IoMdEye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="relative px-20 h-10 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white font-bold text-xs sm:text-sm tracking-wider rounded-xl transition-all duration-300 hover:shadow-[0_6px_15px_rgba(249,115,22,0.15)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none animate-[slideUp_0.5s_ease-out_0.7s_both]"
              >
                {isLoading ? "Sedang masuk..." : "MASUK"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

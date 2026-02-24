import userIcon from "../../assets/icons/profile.svg";
import lockIcon from "../../assets/icons/kunci.svg";
import logoBpkad from "../../assets/images/bpkad-building.png";

type LoginFormProps = {
  username: string;
  password: string;
  rememberMe: boolean;
  isLoading: boolean;
  error: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRememberMeChange: (value: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export default function LoginForm({
  username,
  password,
  rememberMe,
  isLoading,
  error,
  onUsernameChange,
  onPasswordChange,
  onRememberMeChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-8 lg:py-0 order-2 lg:order-1 animate-[slideInLeft_0.6s_ease-out]">
      <div className="w-full max-w-[460px] bg-white rounded-3xl shadow-2xl shadow-orange-500/10 px-6 sm:px-12 py-10 sm:py-14 border border-orange-100/50 backdrop-blur-sm animate-[fadeIn_0.8s_ease-out_0.2s_both]">
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

        <form onSubmit={onSubmit} className="space-y-6">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-sm"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

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
                onChange={(e) => onUsernameChange(e.target.value)}
                maxLength={50}
                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

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
                onChange={(e) => onPasswordChange(e.target.value)}
                maxLength={100}
                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 font-medium"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 animate-[slideUp_0.5s_ease-out_0.7s_both]">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => onRememberMeChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-600">
              Ingat saya
            </label>
          </div>

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

        <div className="mt-8 text-center animate-[fadeIn_0.5s_ease-out_1s_both]">
          <p className="text-xs text-gray-500"></p>
        </div>
      </div>
    </div>
  );
}

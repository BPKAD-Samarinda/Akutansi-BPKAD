import { useNavigate, useLocation } from "react-router-dom";
import { Fragment, useEffect, useState, useMemo } from "react";
import { FiClipboard, FiClock, FiGrid, FiMoon, FiSun, FiFileText, FiUploadCloud, FiUserPlus, FiLogOut } from "react-icons/fi";
import { getUser } from "../../utils/auth";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = window.localStorage.getItem("theme");
    return saved ? saved === "dark" : false;
  });
  const isAdmin = user?.role === "Admin" || user?.role === "Admin Akuntansi";
  const isPkl = user?.role === "Anak PKL";
  const canViewUploadHistory = isAdmin;

  const isActive = (path: string) => location.pathname === path;
  const handleLogout = () => navigate("/login");
  const initials = (user?.username ?? "User")
    .split(" ")
    .map((chunk) => chunk[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const getReactIcon = (path: string, className: string) => {
    switch (path) {
      case "/dashboard":
        return <FiGrid className={className} />;
      case "/dokumen-management":
        return <FiFileText className={className} />;
      case "/skp":
        return <FiClipboard className={className} />;
      case "/add-user":
        return <FiUserPlus className={className} />;
      case "/riwayat":
        return <FiClock className={className} />;
      default:
        return <FiFileText className={className} />;
    }
  };

  const getIcon = (path: string, active: boolean) => {
    const baseClass = "w-[18px] h-[18px] transition-colors duration-200";
    if (active) {
      return getReactIcon(path, `${baseClass} text-indigo-600 dark:text-indigo-400`);
    } else {
      return getReactIcon(path, `${baseClass} text-slate-400 dark:text-slate-500 group-hover:text-slate-650 dark:group-hover:text-slate-350`);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const menuItems = useMemo(() => {
    return [
      { path: "/dashboard", label: "Dashboard", visible: true },
      { path: "/dokumen-management", label: "Manajemen Dokumen", visible: true },
      { path: "/skp", label: "Sasaran Kinerja Pegawai", visible: true },
      { path: "/add-user", label: "Tambah Pengguna", visible: isAdmin },
      { path: "/riwayat", label: "Riwayat", visible: canViewUploadHistory },
    ].filter(item => item.visible);
  }, [isAdmin, canViewUploadHistory]);

  const currentIndex = menuItems.findIndex(item => isActive(item.path));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fromPath = (location.state as any)?.fromPath;
  const previousIndex = fromPath ? menuItems.findIndex(item => item.path === fromPath) : -1;
  const [animatedIndex, setAnimatedIndex] = useState(previousIndex !== -1 ? previousIndex : currentIndex);

  useEffect(() => {
    if (animatedIndex !== currentIndex) {
      const timer = setTimeout(() => {
        setAnimatedIndex(currentIndex);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, animatedIndex]);

  return (
    <Fragment>
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 bg-black/30 lg:hidden z-40"
          aria-label="Tutup menu"
        />
      )}
      <aside
        className={`fixed top-0 left-0 w-[280px] h-screen bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60 shadow-2xl shadow-slate-200/20 dark:shadow-none z-50 flex flex-col transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-5">
          <div className="group bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3 flex items-center gap-3 transition-all duration-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:shadow-slate-200/20 dark:hover:shadow-none hover:border-slate-200 dark:hover:border-slate-700">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shadow-inner text-sm tracking-wider">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {user?.username ?? "Admin"}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {user?.role ?? "Akuntansi"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-3 flex-1 overflow-y-auto custom-scrollbar">
          <div className="mx-2 mb-4 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
          <nav className="relative flex flex-col gap-1.5 px-2">
            <div
              className={`absolute left-2 right-2 rounded-xl transition-all duration-500 ease-custom-bounce bg-indigo-50/80 border border-indigo-100/50 shadow-sm shadow-indigo-100/20 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:shadow-none`}
              style={{
                height: '44px',
                top: animatedIndex >= 0 ? `${animatedIndex * 50}px` : '0px',
                opacity: animatedIndex >= 0 ? 1 : 0
              }}
            />
            {menuItems.map((item) => {
              const active = isActive(item.path);
              
              let activeTextClass = "text-indigo-700 dark:text-indigo-300 font-bold";
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path, { state: { fromPath: location.pathname } });
                    onClose?.();
                  }}
                  className={`group relative z-10 w-full flex items-center gap-3.5 px-4 rounded-xl text-sm font-semibold text-left transition-all duration-300 h-[44px]
                  ${active 
                    ? activeTextClass 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"}`}
                >
                  <div className={`flex items-center justify-center transition-transform duration-300 ${active ? "scale-110" : "group-hover:scale-110"}`}>
                    {getIcon(item.path, active)}
                  </div>
                  <span className="whitespace-nowrap truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto px-5 pb-6 pt-4">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-5"></div>
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="w-full flex items-center justify-between rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            aria-label="Ubah mode tampilan"
          >
            <span className="flex items-center gap-2.5">
              {isDark ? <FiSun className="h-4.5 w-4.5 text-indigo-400" /> : <FiMoon className="h-4.5 w-4.5 text-indigo-500" />}
              {isDark ? "Mode Terang" : "Mode Gelap"}
            </span>
            <span
              className={`relative inline-flex h-[22px] w-[38px] items-center rounded-full transition-colors duration-300 ${
                isDark ? "bg-indigo-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-sm ${
                  isDark ? "translate-x-[18px]" : "translate-x-[2px]"
                }`}
              />
            </span>
          </button>
          
          <button
            type="button"
            onClick={handleLogout}
            className="group w-full flex items-center justify-center gap-2 mt-3 rounded-xl border border-transparent bg-slate-50 dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-red-50 hover:border-red-100 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:border-red-500/20 dark:hover:text-red-400 transition-all duration-300"
            aria-label="Keluar"
          >
            <FiLogOut className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
            Keluar
          </button>
        </div>
      </aside>
    </Fragment>
  );
}



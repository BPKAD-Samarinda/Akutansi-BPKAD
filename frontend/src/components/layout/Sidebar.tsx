import { useNavigate, useLocation } from "react-router-dom";
import { Fragment, useEffect, useState, useMemo } from "react";
import { FiClipboard, FiClock, FiGrid, FiMoon, FiSun, FiFileText, FiUploadCloud, FiUserPlus } from "react-icons/fi";
import logoutIcon from "../../assets/icons/logout.svg";
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
  const isMagang = user?.role === "Anak Magang";
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
      case "/upload":
        return <FiUploadCloud className={className} />;
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
      if (path === "/upload") {
        return <FiUploadCloud className={`${baseClass} text-indigo-600 dark:text-indigo-400`} />;
      }
      return getReactIcon(path, `${baseClass} text-orange-650 dark:text-orange-400`);
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
      { path: "/upload", label: "Unggah Dokumen", visible: isAdmin || isMagang || isPkl },
      { path: "/add-user", label: "Tambah Pengguna", visible: isAdmin },
      { path: "/riwayat", label: "Riwayat", visible: canViewUploadHistory },
    ].filter(item => item.visible);
  }, [isAdmin, isMagang, isPkl, canViewUploadHistory]);

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
        className={`fixed top-0 left-0 w-64 h-screen bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 shadow-sm z-50 flex flex-col transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="h-11 w-11 rounded-full bg-orange-200 text-orange-700 font-bold flex items-center justify-center">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">
                {user?.username ?? "Admin"}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                {user?.role ?? "Akuntansi"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="h-px bg-gray-200 dark:bg-slate-800 mb-4"></div>
          <nav className="relative flex flex-col gap-1">
            <div
              className={`absolute left-0 w-full rounded-xl border transition-all duration-500 ease-custom-bounce ${
                location.pathname === "/upload"
                  ? "bg-indigo-50/70 border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-900/60"
                  : "bg-orange-50 border-orange-200 dark:bg-slate-800 dark:border-slate-700"
              }`}
              style={{
                height: '46px',
                top: animatedIndex >= 0 ? `${animatedIndex * 50}px` : '0px',
                opacity: animatedIndex >= 0 ? 1 : 0
              }}
            />
            {menuItems.map((item) => {
              const active = isActive(item.path);
              
              let activeTextClass = "text-orange-650 dark:text-slate-100";
              if (item.path === "/upload") {
                activeTextClass = "text-indigo-650 dark:text-indigo-400 font-bold";
              }
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path, { state: { fromPath: location.pathname } });
                    onClose?.();
                  }}
                  className={`group relative z-10 w-full flex items-center gap-3 px-4 rounded-xl text-sm font-semibold text-left transition-all duration-300 h-[46px]
                  ${active 
                    ? activeTextClass 
                    : "text-gray-600 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-slate-900/60"}`}
                >
                  {getIcon(item.path, active)}
                  <span className="whitespace-nowrap truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto px-4 pb-4">
          <div className="h-px bg-gray-200 dark:bg-slate-800 mb-4"></div>
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-semibold text-gray-600 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            aria-label="Ubah mode tampilan"
          >
            <span className="flex items-center gap-2">
              {isDark ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
              {isDark ? "Mode Terang" : "Mode Gelap"}
            </span>
            <span
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDark ? "bg-slate-700" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out ${
                  isDark ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </span>
          </button>
          
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 mt-2 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            aria-label="Keluar"
          >
            <img src={logoutIcon} className="w-4 h-4 filter invert-[34%] sepia-[82%] saturate-[2385%] hue-rotate-[336deg] brightness-[96%] contrast-[97%] dark:invert-[67%] dark:sepia-[33%] dark:saturate-[2343%] dark:hue-rotate-[320deg] dark:brightness-[104%] dark:contrast-[101%]" alt="" />
            Keluar
          </button>
        </div>
      </aside>
    </Fragment>
  );
}



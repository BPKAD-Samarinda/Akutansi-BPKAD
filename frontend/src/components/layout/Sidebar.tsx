import { useNavigate, useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { FiClipboard, FiClock, FiGrid, FiMoon, FiSun } from "react-icons/fi";
import dokumenIcon from "../../assets/icons/dokumen.svg";
import uploadIcon from "../../assets/icons/upload.svg";
import addUserIcon from "../../assets/icons/add_user.svg";
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
  const iconClass = (active: boolean) =>
    `w-4 h-4 ${active ? "text-orange-600 sidebar-icon-active" : "text-gray-500 sidebar-icon"} dark:text-slate-300`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

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
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => {
                navigate("/dashboard");
                onClose?.();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors
              ${
                isActive("/dashboard")
                  ? "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                  : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-900"
              }`}
            >
              <FiGrid className={iconClass(isActive("/dashboard"))} />
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate("/dokumen-management");
                onClose?.();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors
              ${
                isActive("/dokumen-management")
                  ? "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                  : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-900"
              }`}
            >
              <img
                src={dokumenIcon}
                className={iconClass(isActive("/dokumen-management"))}
                alt="Dokumen"
              />
              Manajemen Dokumen
            </button>
            <button
              onClick={() => {
                navigate("/skp");
                onClose?.();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors
              ${
                isActive("/skp")
                  ? "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                  : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-900"
              }`}
            >
              <FiClipboard className={iconClass(isActive("/skp"))} />
              <span className="whitespace-nowrap truncate">Sasaran Kinerja Pegawai</span>
            </button>
            {(isAdmin || isMagang || isPkl) && (
              <button
                onClick={() => {
                  navigate("/upload");
                  onClose?.();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors
              ${
                isActive("/upload")
                  ? "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                  : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-900"
              }`}
              >
                <img
                  src={uploadIcon}
                  className={iconClass(isActive("/upload"))}
                  alt="Unggah"
                />
                Unggah Dokumen
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => {
                  navigate("/add-user");
                  onClose?.();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors
              ${
                isActive("/add-user")
                  ? "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                  : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-900"
              }`}
              >
                <img
                  src={addUserIcon}
                  className={iconClass(isActive("/add-user"))}
                  alt="Tambah User"
                />
                Tambah Pengguna
              </button>
            )}
            {canViewUploadHistory && (
              <button
                onClick={() => {
                  navigate("/riwayat");
                  onClose?.();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors
              ${
                isActive("/riwayat")
                  ? "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                  : "text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-900"
              }`}
              >
                <FiClock className={iconClass(isActive("/riwayat"))} />
                Riwayat
              </button>
            )}
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



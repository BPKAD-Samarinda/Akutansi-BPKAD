import { useNavigate, useLocation } from "react-router-dom";
import { Fragment } from "react";
import dashboardIcon from "../../assets/icons/dashboard.svg";
import dokumenIcon from "../../assets/icons/dokumen.svg";
import uploadIcon from "../../assets/icons/upload.svg";
import addUserIcon from "../../assets/icons/add_user.svg";
import riwayatIcon from "../../assets/icons/riwayat.svg";
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
  const canUploadDocument =
    user?.role === "Admin" || user?.role === "Admin Akuntansi";
  const canViewUploadHistory =
    user?.role === "Admin" || user?.role === "Admin Akuntansi";

  const isActive = (path: string) => location.pathname === path;
  const handleLogout = () => navigate("/login");
  const initials = (user?.username ?? "User")
    .split(" ")
    .map((chunk) => chunk[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const iconClass = (active: boolean) =>
    `w-4 h-4 ${active ? "text-orange-600 sidebar-icon-active" : "text-gray-500 sidebar-icon"}`;

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
        className={`fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 shadow-sm z-50 flex flex-col transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center gap-3 shadow-sm">
            <div className="h-11 w-11 rounded-full bg-orange-200 text-orange-700 font-bold flex items-center justify-center">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.username ?? "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role ?? "Akuntansi"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="h-8 w-8 rounded-lg border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors flex items-center justify-center"
              aria-label="Keluar"
            >
              <img src={logoutIcon} className="w-4 h-4" alt="Logout" />
            </button>
          </div>
        </div>

        <div className="px-4">
          <div className="h-px bg-gray-200 mb-4"></div>
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => {
                navigate("/dashboard");
                onClose?.();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors
              ${
                isActive("/dashboard")
                  ? "bg-orange-50 text-orange-600 border border-orange-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <img
                src={dashboardIcon}
                className={iconClass(isActive("/dashboard"))}
                alt="Dashboard"
              />
              Dashboard
            </button>
            <button
              onClick={() => {
                navigate("/dokumen-management");
                onClose?.();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors
              ${
                isActive("/dokumen-management")
                  ? "bg-orange-50 text-orange-600 border border-orange-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <img
                src={dokumenIcon}
                className={iconClass(isActive("/dokumen-management"))}
                alt="Dokumen"
              />
              Manajemen Dokumen
            </button>
            {canUploadDocument && (
              <button
                onClick={() => {
                  navigate("/upload");
                  onClose?.();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors
              ${
                isActive("/upload")
                  ? "bg-orange-50 text-orange-600 border border-orange-200"
                  : "text-gray-600 hover:bg-gray-100"
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
            {canUploadDocument && (
              <button
                onClick={() => {
                  navigate("/add-user");
                  onClose?.();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors
              ${
                isActive("/add-user")
                  ? "bg-orange-50 text-orange-600 border border-orange-200"
                  : "text-gray-600 hover:bg-gray-100"
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors
              ${
                isActive("/riwayat")
                  ? "bg-orange-50 text-orange-600 border border-orange-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              >
                <img
                  src={riwayatIcon}
                  className={iconClass(isActive("/riwayat"))}
                  alt="Riwayat"
                />
                Riwayat Unggah
              </button>
            )}
          </nav>
        </div>
      </aside>
    </Fragment>
  );
}

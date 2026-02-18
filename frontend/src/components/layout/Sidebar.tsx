import { useNavigate, useLocation } from "react-router-dom";
import homeIcon from "../../assets/icons/home.svg";
import documentIcon from "../../assets/icons/document.svg";
import logoutIcon from "../../assets/icons/logout.svg";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside
      className="fixed top-0 left-0 w-20 lg:w-[88px] h-screen 
      bg-gradient-to-b from-orange-500 to-orange-600 
      flex flex-col items-center py-6 shadow-xl z-50"
    >
      {/* LOGO */}
      <div className="mb-8 text-white text-3xl">
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 8C3 6.89543 3.89543 6 5 6H9.58579C9.851 6 10.1054 6.10536 10.2929 6.29289L12.7071 8.70711C12.8946 8.89464 13.149 9 13.4142 9H19C20.1046 9 21 9.89543 21 11V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V8Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* SEPARATOR LINE */}
      <div className="w-12 h-px bg-white/30 mb-6"></div>

      {/* MENU NAVIGATION */}
      <nav className="flex flex-col gap-4 flex-1">
        <button
          onClick={() => navigate("/dashboarddokumen")}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all
            ${
              isActive("/dashboarddokumen")
                ? "bg-white/30 shadow-lg scale-105"
                : "hover:bg-white/20"
            }`}
          title="Dashboard"
        >
          <img src={homeIcon} className="w-6 h-6" alt="Dashboard" />
        </button>

        <button
          onClick={() => navigate("/upload")}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all
            ${
              isActive("/upload")
                ? "bg-white/30 shadow-lg scale-105"
                : "hover:bg-white/20"
            }`}
          title="Upload Dokumen"
        >
          <img src={documentIcon} className="w-6 h-6" alt="Upload" />
        </button>
      </nav>

      {/* SEPARATOR LINE BEFORE LOGOUT */}
      <div className="w-12 h-px bg-white/30 mb-6"></div>

      {/* LOGOUT - SEPARATED */}
      <button
        onClick={handleLogout}
        className="w-12 h-12 rounded-xl hover:bg-red-500/30 flex items-center justify-center transition-all group"
        title="Keluar"
      >
        <img
          src={logoutIcon}
          className="w-6 h-6 group-hover:scale-110 transition-transform"
          alt="Logout"
        />
      </button>
    </aside>
  );
}

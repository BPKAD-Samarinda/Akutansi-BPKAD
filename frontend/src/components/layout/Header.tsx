import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import bpkadLogo from "../../assets/images/logo-bpkad.png";
import bpkadBuilding from "../../assets/images/bpkad-building.png";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

interface DecodedToken {
  username: string;
  role: string;
}

interface UserInfo {
  username: string;
  role: string;
}

function getUserInfoFromToken(): UserInfo {
  const token =
    sessionStorage.getItem("authToken") ?? localStorage.getItem("authToken");

  if (!token) {
    return { username: "", role: "" };
  }

  try {
    const decodedToken: DecodedToken = jwtDecode(token);
    return {
      username: decodedToken.username ?? "",
      role: decodedToken.role ?? "",
    };
  } catch {
    return { username: "", role: "" };
  }
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const [{ username, role }] = useState<UserInfo>(() => getUserInfoFromToken());

  return (
    <header className="h-16 lg:h-20 bg-white flex items-center justify-between px-4 lg:px-8 shadow-sm border-b border-orange-100/50">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="h-10 w-10 rounded-xl border border-orange-200 bg-white text-orange-600 flex items-center justify-center lg:hidden"
            aria-label="Buka menu"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1">
              <span className="block h-0.5 w-5 rounded bg-orange-500"></span>
              <span className="block h-0.5 w-5 rounded bg-orange-500"></span>
              <span className="block h-0.5 w-5 rounded bg-orange-500"></span>
            </div>
          </button>
        )}
        <div className="text-lg lg:text-2xl font-bold text-gray-800">
          {title}
        </div>
      </div>

      <img
        src={bpkadBuilding}
        className="h-10 lg:h-12 object-contain"
        alt="BPKAD Building"
      />
    </header>
  );
}

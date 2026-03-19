import { useState } from "react";
import { jwtDecode } from "jwt-decode";
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
  useState<UserInfo>(() => getUserInfoFromToken());

  return (
    <header className="relative h-16 lg:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shadow-sm">
      <div className="pointer-events-none absolute inset-x-0 -bottom-[1px] h-[2px] bg-gradient-to-r from-transparent via-slate-200/80 to-transparent blur-[1px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-slate-200/80" />
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center lg:hidden"
            aria-label="Buka menu"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1">
              <span className="block h-0.5 w-5 rounded bg-slate-600"></span>
              <span className="block h-0.5 w-5 rounded bg-slate-600"></span>
              <span className="block h-0.5 w-5 rounded bg-slate-600"></span>
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

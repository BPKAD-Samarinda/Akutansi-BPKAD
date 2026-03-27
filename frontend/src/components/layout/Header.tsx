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
    <header className="relative h-16 lg:h-20 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 shadow-sm">
      <div className="pointer-events-none absolute inset-x-0 -bottom-[1px] h-[2px] bg-gradient-to-r from-transparent via-slate-200/80 to-transparent blur-[1px] dark:via-slate-800/80" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-slate-200/80 dark:bg-slate-800/80" />
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Buka menu"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1">
              <span className="block h-0.5 w-5 rounded bg-slate-600 dark:bg-slate-200"></span>
              <span className="block h-0.5 w-5 rounded bg-slate-600 dark:bg-slate-200"></span>
              <span className="block h-0.5 w-5 rounded bg-slate-600 dark:bg-slate-200"></span>
            </div>
          </button>
        )}
        <div className="text-lg lg:text-2xl font-bold text-gray-800 dark:text-slate-100">
          {title}
        </div>
      </div>

      <img
        src={bpkadBuilding}
        className="h-9 lg:h-11 object-contain"
        alt="BPKAD Kota Samarinda"
      />
    </header>
  );
}

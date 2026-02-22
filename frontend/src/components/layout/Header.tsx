import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import profileIcon from "../../assets/icons/profile.svg";

interface HeaderProps {
  title?: string;
}

interface DecodedToken {
  username: string;
  role: string;
}

export default function Header({ title }: HeaderProps) {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      setUsername(decodedToken.username);
      setRole(decodedToken.role);
    }
  }, []);

  return (
    <header className="h-16 lg:h-20 bg-white flex items-center justify-between lg:justify-end px-4 lg:px-8 shadow-sm">
      {/* Mobile Title - Hidden on desktop */}
      {title && (
        <h1 className="text-lg font-bold text-gray-800 lg:hidden">{title}</h1>
      )}

      {/* Profile Section */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs lg:text-sm font-semibold text-gray-800">
            {username}
          </p>
          <p className="text-[10px] lg:text-xs text-gray-500">
            {role}
          </p>
        </div>
        <div className="relative">
          <img
            src={profileIcon}
            className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-gray-200"
            alt="Profile"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
      </div>
    </header>
  );
}

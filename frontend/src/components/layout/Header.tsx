import profileIcon from "../../assets/icons/profile.svg";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
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
            Asnan Fadjri Wahyudi
          </p>
          <p className="text-[10px] lg:text-xs text-gray-500">
            Staff Akuntansi
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

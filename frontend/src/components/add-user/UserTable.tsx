import type { UserItem } from "../../hooks/add-user/types";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

type UserTableProps = {
  users: UserItem[];
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
};

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const formatRole = (role: UserItem["role"]) => {
    const normalized = (role ?? "").toString().trim();
    if (!normalized) return "Belum diisi";
    if (normalized === "Admin Akuntansi" || normalized === "Admin") return "Admin";
    if (normalized === "Staff Akuntansi" || normalized === "Staff") return "Staff";
    if (normalized === "Anak Magang") return "Magang";
    if (normalized === "Anak PKL") return "PKL";
    return normalized;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
      {/* Section Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#FF7A00] rounded-full" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            Pengguna & Staff
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-[1.4fr_1.2fr_1.1fr_0.6fr] gap-4 px-6 py-4 text-xs font-bold uppercase tracking-wider text-white" style={{ backgroundColor: '#FF7A00' }}>
        <span>Profil</span>
        <span>Identitas</span>
        <span>Bidang</span>
        <span className="text-center">Aksi</span>
      </div>

      {users.length === 0 ? (
        <div className="px-6 py-12 text-center text-gray-400 dark:text-slate-500">
          Belum ada pengguna.
        </div>
      ) : (
        <div className="max-h-[620px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((user) => {
            const initials = user.username
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            return (
              <div key={user.id} className="grid grid-cols-[1.4fr_1.2fr_1.1fr_0.6fr] gap-4 px-6 py-5 items-center hover:bg-slate-50/60 dark:hover:bg-slate-900/60 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-orange-100 text-orange-600 font-bold flex items-center justify-center">
                    {initials || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-slate-100">{user.username}</p>
                  </div>
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                    <span className="text-[#FF7A00]">🏷</span>
                    {formatRole(user.role)}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Akuntansi</p>
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                    aria-label="Edit pengguna"
                  >
                    <FiEdit3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(user)}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    aria-label="Hapus pengguna"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

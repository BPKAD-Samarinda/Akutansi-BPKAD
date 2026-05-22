import type { UserItem } from "../../hooks/add-user/types";
import { FiEdit3, FiTrash2, FiUser, FiShield, FiPieChart, FiUserPlus } from "react-icons/fi";

type UserTableProps = {
  users: UserItem[];
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
  onAddClick: () => void;
};

export default function UserTable({ users, onEdit, onDelete, onAddClick }: UserTableProps) {
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
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-600 active:scale-95 shadow-sm"
        >
          <FiUserPlus className="h-4 w-4" />
          Tambah Pengguna
        </button>
      </div>

      <div className="grid grid-cols-[0.5fr_1.4fr_1.2fr_1.1fr_0.8fr] gap-4 px-6 py-4 text-xs font-bold uppercase tracking-wider text-white bg-[#eab308] rounded-t-xl">
        <span className="text-center">No</span>
        <span>Profil / Nama</span>
        <span>Akses / Role</span>
        <span>Bidang</span>
        <span className="text-center">Aksi</span>
      </div>

      {users.length === 0 ? (
        <div className="px-6 py-12 text-center text-gray-400 dark:text-slate-500">
          Belum ada pengguna.
        </div>
      ) : (
        <div className="max-h-[620px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {users.map((user, index) => {
            return (
              <div key={user.id} className="grid grid-cols-[0.5fr_1.4fr_1.2fr_1.1fr_0.8fr] gap-4 px-6 py-4 items-center hover:bg-yellow-50 dark:hover:bg-amber-500/10 transition-colors">
                <div className="text-center text-sm font-semibold text-slate-500">
                  {index + 1}
                </div>
                <div className="flex items-center gap-3">
                  <FiUser className="h-4 w-4 text-slate-400 shrink-0" />
                  <p className="font-semibold text-gray-800 dark:text-slate-100">{user.username}</p>
                </div>

                <div className="flex items-center gap-2">
                  <FiShield className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {formatRole(user.role)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FiPieChart className="h-4 w-4 text-slate-400 shrink-0" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Akuntansi</p>
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
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

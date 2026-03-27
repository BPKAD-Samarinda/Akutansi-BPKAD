import type { UserItem } from "../../hooks/add-user/types";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";

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
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">Pengguna & Staff</h3>
        </div>
      </div>

      <div className="grid grid-cols-[1.4fr_1.2fr_1.1fr_0.6fr] gap-4 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white bg-gradient-to-r from-orange-500 to-orange-600">
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
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 text-xs font-semibold px-3 py-1">
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
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-amber-600 bg-amber-50/70 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                    aria-label="Edit pengguna"
                  >
                    <img src={editIcon} className="w-4 h-4 icon-amber" alt="Edit" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(user)}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-red-600 bg-red-50/70 hover:bg-red-100 hover:text-red-700 transition-colors"
                    aria-label="Hapus pengguna"
                  >
                    <img src={deleteIcon} className="w-4 h-4 icon-red" alt="Delete" />
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

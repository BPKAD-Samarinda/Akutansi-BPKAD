import type { UserItem } from "../../pages/AddUser.types";

type UserTableProps = {
  users: UserItem[];
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
};

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="bg-white rounded-3xl border border-orange-100/60 shadow-sm">
      <div className="px-6 py-5 border-b border-orange-100/60 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Daftar Pengguna</h3>
          <p className="text-sm text-gray-500">Kelola pengguna yang aktif.</p>
        </div>
        <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
          {users.length} pengguna
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Nama Pengguna
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Peran
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Dibuat
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                  Belum ada pengguna.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-orange-100/60 hover:bg-orange-50/40 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-gray-800">{user.username}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        user.role === "Admin Akuntansi"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                        aria-label="Edit pengguna"
                      >
                        <svg className="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M4 20h4l10-10-4-4L4 16v4z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 6l4 4"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(user)}
                        className="h-8 w-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        aria-label="Hapus pengguna"
                      >
                        <svg className="w-4 h-4 mx-auto" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M6 7h12M10 11v6m4-6v6M9 7V5h6v2"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

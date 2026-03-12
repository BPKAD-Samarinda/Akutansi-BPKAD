import type { UserItem, UserRole } from "../../pages/AddUser.types";

type EditUserModalProps = {
  user: UserItem;
  onClose: () => void;
  onSave: () => void;
  onChangeUsername: (value: string) => void;
  onChangeRole: (value: UserRole) => void;
};

export default function EditUserModal({
  user,
  onClose,
  onSave,
  onChangeUsername,
  onChangeRole,
}: EditUserModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-orange-100 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Edit Pengguna</h3>
            <p className="text-sm text-gray-500">Perbarui informasi pengguna.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-500"
            aria-label="Tutup"
          >
            X
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Pengguna</label>
            <input
              type="text"
              value={user.username}
              onChange={(event) => onChangeUsername(event.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Peran</label>
            <select
              value={user.role}
              onChange={(event) => onChangeRole(event.target.value as UserRole)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white"
            >
              <option value="Staff Akuntansi">Staff Akuntansi</option>
              <option value="Admin Akuntansi">Admin Akuntansi</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

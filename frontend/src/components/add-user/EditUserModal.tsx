import type { UserItem, UserRole } from "../../pages/AddUser.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
    <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
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
            <Select
              value={user.role}
              onValueChange={(value) => onChangeRole(value as UserRole)}
            >
              <SelectTrigger className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                <SelectValue placeholder="Pilih peran" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Anak Magang">Anak Magang</SelectItem>
                <SelectItem value="Anak PKL">Anak PKL</SelectItem>
              </SelectContent>
            </Select>
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

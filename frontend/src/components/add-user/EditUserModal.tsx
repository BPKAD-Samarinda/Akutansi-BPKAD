import type { UserItem, UserRole } from "../../hooks/add-user/types";
import React from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type EditUserModalProps = {
  user: UserItem;
  password: string;
  onClose: () => void;
  onSave: () => void;
  onChangeUsername: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangeRole: (value: UserRole) => void;
};

export default function EditUserModal({
  user,
  password,
  onClose,
  onSave,
  onChangeUsername,
  onChangePassword,
  onChangeRole,
}: EditUserModalProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-orange-100 dark:border-slate-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-slate-100">Edit Pengguna</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">Perbarui informasi pengguna.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-300"
            aria-label="Tutup"
          >
            X
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Nama Pengguna</label>
            <input
              type="text"
              value={user.username}
              onChange={(event) => onChangeUsername(event.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">
              Kata Sandi Baru (Opsional)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => onChangePassword(event.target.value)}
                placeholder="Kosongkan jika tidak diganti"
                className="w-full border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 pr-11 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 transition-colors hover:text-orange-600"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
              >
                {showPassword ? (
                  <IoMdEyeOff className="h-5 w-5" />
                ) : (
                  <IoMdEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-slate-200 mb-2">Peran</label>
            <Select
              value={user.role}
              onValueChange={(value) => onChangeRole(value as UserRole)}
            >
              <SelectTrigger className="h-11 w-full rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/20">
                <SelectValue placeholder="Pilih peran" />
              </SelectTrigger>
              <SelectContent className="max-h-60 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100">
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
            className="px-4 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-xl text-gray-700 dark:text-slate-200 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-gray-400 dark:hover:border-slate-500 transition-all duration-300"
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

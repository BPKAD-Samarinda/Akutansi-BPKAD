import React from "react";
import { FiX } from "react-icons/fi";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import type { UserItem, UserRole } from "../../hooks/add-user/types";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-2xl max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl animate-[scaleIn_0.25s_ease-out] dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-amber-600 px-6 py-5 text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-yellow-100">
                Pembaruan Profil
              </p>
              <h2 className="mt-2 text-2xl font-bold">Edit Pengguna</h2>
              <p className="mt-2 text-sm text-yellow-100">
                Perbarui informasi nama, kata sandi, atau hak akses pengguna.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white transition hover:bg-white/20"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-5 px-6 py-6 overflow-y-auto"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Nama Pengguna
              </label>
              <input
                type="text"
                value={user.username}
                onChange={(event) => onChangeUsername(event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Kata Sandi Baru (Opsional)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => onChangePassword(event.target.value)}
                  placeholder="Kosongkan jika tidak ingin mengubah kata sandi"
                  className="h-12 w-full rounded-2xl border border-slate-200 px-4 pr-11 text-sm text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 transition-colors hover:text-amber-600"
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

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Akses / Peran
              </label>
              <Select
                value={user.role}
                onValueChange={(value) => onChangeRole(value as UserRole)}
              >
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:ring-0 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                  <SelectValue placeholder="Pilih peran pengguna" />
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Anak Magang">Anak Magang</SelectItem>
                  <SelectItem value="Anak PKL">Anak PKL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-slate-100 pt-5 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-amber-600"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

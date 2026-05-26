import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FiFileText, FiUploadCloud, FiX } from "react-icons/fi";
import { triwulanFormOptions, yearOptions } from "./constants";
import type { UserApiItem } from "../../types/user";
import type { EditForm } from "./types";
import { getFileNameFromPath } from "./utils";
import type { FormEvent } from "react";

interface SkpEditModalProps {
  editing: EditForm;
  setEditing: React.Dispatch<React.SetStateAction<EditForm | null>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isAdmin: boolean;
  usersList: UserApiItem[];
  isSubmittingEdit: boolean;
}

export default function SkpEditModal({
  editing,
  setEditing,
  onSubmit,
  isAdmin,
  usersList,
  isSubmittingEdit,
}: SkpEditModalProps) {
  if (!editing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="w-full max-w-2xl max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl animate-[scaleIn_0.25s_ease-out] dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-blue-600 px-6 py-5 text-white shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-indigo-100">
                Pembaruan Dokumen
              </p>
              <h2 className="mt-2 text-2xl font-bold">Edit SKP</h2>
              <p className="mt-2 text-sm text-indigo-100">
                Kamu bisa mengganti metadata SKP sekaligus mengganti file dokumennya.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white transition hover:bg-white/20"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 px-6 py-6 overflow-y-auto">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {isAdmin && (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Ubah User Dokumen (Opsional)
                </label>
                <Select
                  value={editing.target_user || "self"}
                  onValueChange={(value) =>
                    setEditing((prev) =>
                      prev
                        ? { ...prev, target_user: value === "self" ? "" : value }
                        : prev,
                    )
                  }
                >
                  <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:ring-0 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                    <SelectValue placeholder="Pilih User" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                    <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" value="self">Diri Sendiri (Anda)</SelectItem>
                    {usersList.map((u) => (
                      <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" key={u.id} value={u.username}>
                        {u.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Nama SKP
              </label>
              <input
                type="text"
                value={editing.nama_skp}
                onChange={(event) =>
                  setEditing((prev) => (prev ? { ...prev, nama_skp: event.target.value } : prev))
                }
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Periode
              </label>
              <Select
                value={String(editing.triwulan)}
                onValueChange={(value) =>
                  setEditing((prev) =>
                    prev ? { ...prev, triwulan: Number(value) } : prev,
                  )
                }
              >
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:ring-0 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                  {triwulanFormOptions.map((option) => (
                    <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Tahun
              </label>
              <Select
                value={String(editing.tahun)}
                onValueChange={(value) =>
                  setEditing((prev) =>
                    prev ? { ...prev, tahun: Number(value) } : prev,
                  )
                }
              >
                <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 focus:ring-0 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                  {yearOptions.map((year) => (
                    <SelectItem className="focus:bg-indigo-50 focus:text-indigo-600 data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-600 data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-600 dark:focus:bg-slate-800 dark:focus:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100 dark:data-[state=checked]:bg-slate-800 dark:data-[state=checked]:text-slate-100" key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Ganti Dokumen (opsional)
            </label>
            <label className="block rounded-[24px] border border-dashed border-indigo-200 bg-indigo-50/50 p-5 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/15 cursor-pointer">
              <div className="flex flex-col items-center justify-center text-center relative">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                  <FiFileText className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 px-2 truncate w-full">
                  {editing.file
                    ? editing.file.name
                    : (editing.file_path ? getFileNameFromPath(editing.file_path) : "Pilih dokumen SKP")}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold text-white">
                  <FiUploadCloud className="h-4 w-4" />
                  Ganti File
                </span>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={(event) =>
                  setEditing((prev) =>
                    prev ? { ...prev, file: event.target.files?.[0] || null } : prev,
                  )
                }
                className="hidden"
              />
            </label>

            {editing.file && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setEditing((prev) =>
                      prev ? { ...prev, file: null } : prev,
                    )
                  }
                  className="text-xs font-semibold text-red-500 hover:text-red-650 transition"
                >
                  Batal Ganti & Gunakan File Lama
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="h-12 rounded-2xl px-5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "oklch(63.7% 0.237 25.331)" }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmittingEdit}
              className="h-12 rounded-2xl px-5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-70"
              style={{ backgroundColor: "oklch(72.3% 0.219 149.579)" }}
            >
              {isSubmittingEdit ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

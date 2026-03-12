import type { AddUserFormValues } from "../../pages/AddUser.types";

type AddUserFormProps = {
  form: AddUserFormValues;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export default function AddUserForm({ form, onChange, onSubmit, onCancel }: AddUserFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-orange-100/60 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zM16 14c-2.761 0-5 1.79-5 4v2h10v-2c0-2.21-2.239-4-5-4zM8 14c-2.761 0-5 1.79-5 4v2h6v-2c0-1.33.402-2.57 1.09-3.62C9.479 14.134 8.76 14 8 14z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Tambah Pengguna</h2>
            <p className="text-sm text-gray-500">Lengkapi data pengguna baru.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Pengguna</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="Masukkan username"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kata Sandi</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Masukkan kata sandi"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Peran</label>
            <select
              name="role"
              value={form.role}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 bg-white"
            >
              <option value="Staff Akuntansi">Staff Akuntansi</option>
              <option value="Admin Akuntansi">Admin Akuntansi</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300"
          >
            Simpan Pengguna
          </button>
        </div>
      </div>
    </form>
  );
}

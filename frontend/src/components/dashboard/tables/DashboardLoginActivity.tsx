type LoginRow = {
  id: number;
  username: string;
  role: "Admin" | "Staff";
  loginAt: string;
};

type Props = {
  data: LoginRow[];
};

export default function DashboardLoginActivity({ data }: Props) {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100/60 rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            Aktivitas Login
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Riwayat akses pengguna ke sistem.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {data.length} aktivitas
        </span>
      </div>

      <div className="max-h-[420px] overflow-y-auto overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-slate-50 to-indigo-50/60">
            <tr className="text-slate-500 border-y border-slate-100">
              <th className="text-left px-4 py-3 text-xs font-semibold">No</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Waktu login</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((row, index) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 hover:bg-indigo-50/50 transition-colors"
              >
                <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3 text-slate-900 font-semibold">
                  {row.username}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      row.role === "Admin"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {row.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{row.loginAt}</td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-5 text-sm text-gray-500 text-center">
                  Belum ada aktivitas login.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

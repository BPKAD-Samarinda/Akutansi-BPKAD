type LoginRow = {
  id: number;
  username: string;
  role: "Admin" | "Staff";
  loginAt: string;
};

type Props = {
  data: LoginRow[];
};

function formatLoginAt(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function DashboardLoginActivity({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Aktivitas Login</h3>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <tr>
              <th className="px-4 py-4 text-left font-semibold uppercase tracking-wide">User</th>
              <th className="px-4 py-4 text-left font-semibold uppercase tracking-wide">Role</th>
              <th className="px-4 py-4 text-left font-semibold uppercase tracking-wide">Waktu Login</th>
              <th className="px-4 py-4 text-left font-semibold uppercase tracking-wide">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 bg-white">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-800">{row.username}</p>
                </td>
                  

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-lg px-3 py-1 text-xs font-semibold ${
                      row.role === "Admin"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {row.role}
                  </span>
                </td>

                <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                  {formatLoginAt(row.loginAt)}
                </td>

                <td className="px-4 py-4">
                  <span className="inline-flex rounded-lg bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">
                    Berhasil
                  </span>
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                  Tidak ada data login.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900">
          Aktivitas Login
        </h3>
      </div>

      <div className="max-h-[420px] overflow-y-auto overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
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
                className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                <td className="px-4 py-3 text-slate-800 font-medium">{row.username}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      row.role === "Admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-orange-100 text-orange-700"
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

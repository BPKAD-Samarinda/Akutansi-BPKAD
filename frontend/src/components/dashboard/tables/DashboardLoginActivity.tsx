type LoginRow = {
  id: number;
  username: string;
  role: "Admin" | "Staff";
  loginAt: string;
  status?: string;
};

type Props = {
  data: LoginRow[];
};

export default function DashboardLoginActivity({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
        Aktivitas Login
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-500">
              <th className="text-left px-4 py-3 text-xs font-semibold">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Waktu login</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-800">{row.username}</td>
                <td className="px-4 py-3 text-gray-700">{row.role}</td>
                <td className="px-4 py-3 text-gray-700">{row.loginAt}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    {row.status ?? "Aktif"}
                  </span>
                </td>
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

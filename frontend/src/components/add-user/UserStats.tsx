type UserStatsProps = {
  total: number;
  adminCount: number;
  staffCount: number;
};

export default function UserStats({ total, adminCount, staffCount }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Total Pengguna
        </p>
        <p className="text-2xl font-bold text-orange-600 mt-2">{total}</p>
      </div>
      <div className="bg-white rounded-2xl border border-blue-100 p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Admin
        </p>
        <p className="text-2xl font-bold text-blue-600 mt-2">{adminCount}</p>
      </div>
      <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Staff
        </p>
        <p className="text-2xl font-bold text-emerald-600 mt-2">{staffCount}</p>
      </div>
    </div>
  );
}

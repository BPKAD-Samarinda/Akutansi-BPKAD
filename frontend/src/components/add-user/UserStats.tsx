type UserStatsProps = {
  total: number;
  adminCount: number;
  staffCount: number;
  magangCount: number;
  pklCount: number;
};

export default function UserStats({
  total,
  adminCount,
  staffCount,
  magangCount,
  pklCount,
}: UserStatsProps) {
  const cardBase =
    "rounded-2xl p-4 shadow-sm text-center text-white " +
    "transition-transform duration-200 hover:-translate-y-1 hover:shadow-md";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      <div className={`${cardBase} bg-gradient-to-br from-orange-400 to-orange-600`}>
        <p className="text-2xl font-bold">{total}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mt-2">
          Total Pengguna
        </p>
      </div>
      <div className={`${cardBase} bg-gradient-to-br from-blue-400 to-blue-600`}>
        <p className="text-2xl font-bold">{adminCount}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mt-2">
          Admin
        </p>
      </div>
      <div className={`${cardBase} bg-gradient-to-br from-emerald-400 to-emerald-600`}>
        <p className="text-2xl font-bold">{staffCount}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mt-2">
          Staff
        </p>
      </div>
      <div className={`${cardBase} bg-gradient-to-br from-amber-400 to-amber-600`}>
        <p className="text-2xl font-bold">{magangCount}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mt-2">
          Anak Magang
        </p>
      </div>
      <div className={`${cardBase} bg-gradient-to-br from-violet-400 to-violet-600`}>
        <p className="text-2xl font-bold">{pklCount}</p>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mt-2">
          Anak PKL
        </p>
      </div>
    </div>
  );
}

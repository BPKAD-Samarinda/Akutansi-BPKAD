type DashboardStat = {
  label: string;
  value: number;
  accent?: "orange" | "dark" | "default";
};

type DashboardStatCardsProps = {
  stats: DashboardStat[];
};

export default function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
        >
          <p className="text-sm text-gray-500">{item.label}</p>
          <p
            className={`mt-1 text-3xl font-bold ${
              item.accent === "orange"
                ? "text-orange-500"
                : item.accent === "dark"
                  ? "text-gray-800"
                  : "text-gray-900"
            }`}
          >
            {item.value.toLocaleString("id-ID")}
          </p>
        </div>
      ))}
    </div>
  );
}

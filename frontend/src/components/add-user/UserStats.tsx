import React from "react";

type UserStatsProps = {
  total: number;
  adminCount: number;
  staffCount: number;
  magangCount: number;
  pklCount: number;
};

type AnimatedNumberProps = {
  value: number;
  duration?: number;
};

function AnimatedNumber({ value, duration = 900 }: AnimatedNumberProps) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return <>{display}</>;
}

export default function UserStats({
  total,
  adminCount,
  staffCount,
  magangCount,
  pklCount,
}: UserStatsProps) {
  const cardBase =
    "rounded-2xl p-4 shadow-sm text-center text-white " +
    "transition-transform duration-200 hover:-translate-y-1 hover:shadow-md " +
    "animate-[statIn_0.55s_ease-out_var(--stat-delay)_both]";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      <div
        className={`${cardBase} bg-gradient-to-br from-orange-500 to-orange-700`}
        style={{ "--stat-delay": "0ms" } as React.CSSProperties}
      >
        <p className="text-2xl font-bold">
          <AnimatedNumber value={total} />
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mt-2">
          Total Pengguna
        </p>
      </div>
      <div
        className={`${cardBase} bg-gradient-to-br from-sky-500 to-blue-700`}
        style={{ "--stat-delay": "70ms" } as React.CSSProperties}
      >
        <p className="text-2xl font-bold">
          <AnimatedNumber value={adminCount} />
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mt-2">
          Admin
        </p>
      </div>
      <div
        className={`${cardBase} bg-gradient-to-br from-emerald-500 to-emerald-700`}
        style={{ "--stat-delay": "140ms" } as React.CSSProperties}
      >
        <p className="text-2xl font-bold">
          <AnimatedNumber value={staffCount} />
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mt-2">
          Staff
        </p>
      </div>
      <div
        className={`${cardBase} bg-gradient-to-br from-amber-500 to-orange-600`}
        style={{ "--stat-delay": "210ms" } as React.CSSProperties}
      >
        <p className="text-2xl font-bold">
          <AnimatedNumber value={magangCount} />
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mt-2">
          Anak Magang
        </p>
      </div>
      <div
        className={`${cardBase} bg-gradient-to-br from-violet-500 to-purple-700`}
        style={{ "--stat-delay": "280ms" } as React.CSSProperties}
      >
        <p className="text-2xl font-bold">
          <AnimatedNumber value={pklCount} />
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80 mt-2">
          Anak PKL
        </p>
      </div>
    </div>
  );
}

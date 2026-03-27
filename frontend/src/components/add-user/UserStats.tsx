import React from "react";
import { FaUsers, FaUserShield, FaUserTie, FaUserGraduate } from "react-icons/fa";

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
    "relative overflow-hidden rounded-3xl px-6 py-6 min-h-[120px] " +
    "shadow-[0_14px_26px_rgba(0,0,0,0.14)] text-center text-white " +
    "transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(0,0,0,0.16)] " +
    "animate-[statIn_0.55s_ease-out_var(--stat-delay)_both]";

  const cards = [
    {
      label: "Total Pengguna",
      value: total,
      gradient: "from-orange-500 to-orange-700",
      icon: FaUsers,
      delay: "0ms",
    },
    {
      label: "Admin",
      value: adminCount,
      gradient: "from-sky-500 to-blue-700",
      icon: FaUserShield,
      delay: "70ms",
    },
    {
      label: "Staff",
      value: staffCount,
      gradient: "from-emerald-500 to-emerald-700",
      icon: FaUserTie,
      delay: "140ms",
    },
    {
      label: "Anak Magang",
      value: magangCount,
      gradient: "from-amber-500 to-orange-600",
      icon: FaUserGraduate,
      delay: "210ms",
    },
    {
      label: "Anak PKL",
      value: pklCount,
      gradient: "from-violet-500 to-purple-700",
      icon: FaUserGraduate,
      delay: "280ms",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`${cardBase} bg-gradient-to-r ${card.gradient}`}
            style={{ "--stat-delay": card.delay } as React.CSSProperties}
          >
            <span className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/15" />
            <span className="absolute right-6 top-10 h-16 w-16 rounded-full bg-white/10" />
            <div className="absolute right-4 top-4 h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Icon className="text-white/90" size={18} />
            </div>

            <p className="text-4xl font-bold leading-none">
              <AnimatedNumber value={card.value} />
            </p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 mt-3">
              {card.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";

type Props = {
  items: string[];
};

export default function ActiveFilterIndicator({ items }: Props) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const animationKey = useMemo(() => items.join("|"), [items]);

  useEffect(() => {
    if (!boxRef.current) return;
    gsap.fromTo(
      boxRef.current,
      { autoAlpha: 0, y: -6, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" },
    );
  }, [animationKey]);

  return (
    <div
      ref={boxRef}
      className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs text-gray-700 lg:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      <span className="font-semibold">Filter Aktif</span>
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] text-gray-700 lg:text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

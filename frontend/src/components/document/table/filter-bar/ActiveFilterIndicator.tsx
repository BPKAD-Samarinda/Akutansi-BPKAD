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
      className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-xs text-orange-700 lg:text-sm"
    >
      <span className="font-semibold">Filter Aktif</span>
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center rounded-full border border-orange-200 bg-white px-2.5 py-1 text-[11px] text-orange-700 lg:text-xs"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

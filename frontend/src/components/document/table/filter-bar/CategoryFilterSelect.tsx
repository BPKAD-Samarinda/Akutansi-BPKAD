import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { FaChevronDown } from "react-icons/fa";

type CategoryFilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

const categoryOptions = [
  { value: "", label: "Semua Kategori" },
  { value: "Lampiran", label: "Lampiran" },
  { value: "Keuangan", label: "Keuangan" },
];

export default function CategoryFilterSelect({
  value,
  onChange,
}: CategoryFilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const chevronRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const targetNode = event.target as Node;
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(targetNode) &&
        (!dropdownRef.current || !dropdownRef.current.contains(targetNode))
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!chevronRef.current) return;

    gsap.to(chevronRef.current, {
      rotate: isOpen ? 180 : 0,
      duration: 0.18,
      ease: "power2.out",
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !dropdownRef.current) return;

    gsap.fromTo(
      dropdownRef.current,
      { autoAlpha: 0, y: -6, scale: 0.98 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.18,
        ease: "power2.out",
      },
    );
  }, [isOpen]);

  const closeDropdownWithAnimation = () => {
    if (!dropdownRef.current) {
      setIsOpen(false);
      return;
    }

    gsap.to(dropdownRef.current, {
      autoAlpha: 0,
      y: -6,
      scale: 0.98,
      duration: 0.14,
      ease: "power2.in",
      onComplete: () => setIsOpen(false),
    });
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdownWithAnimation();
      return;
    }

    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }

    setIsOpen(true);
  };

  const selectedLabel =
    categoryOptions.find((option) => option.value === value)?.label ||
    "Semua Kategori";

  const dropdown =
    isOpen &&
    createPortal(
      <div
        ref={dropdownRef}
        style={{
          position: "absolute",
          top: dropdownPos.top,
          left: dropdownPos.left,
          width: dropdownPos.width,
          zIndex: 99999,
        }}
        className="border border-gray-200 rounded-xl bg-white shadow-lg p-1 font-['Plus_Jakarta_Sans',sans-serif]"
      >
        {categoryOptions.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => {
              onChange(option.value);
              closeDropdownWithAnimation();
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-xs lg:text-sm hover:bg-gray-100 ${
              value === option.value
                ? "bg-orange-50 text-orange-600 font-semibold"
                : "text-gray-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>,
      document.body,
    );

  return (
    <div className="font-['Plus_Jakarta_Sans',sans-serif]">
      <label className="text-xs lg:text-sm font-semibold text-gray-600 mb-2 block">
        Kategori
      </label>
      <div ref={wrapperRef} className="relative">
        <button
          type="button"
          title="Category"
          onClick={toggleDropdown}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 lg:py-3 text-xs lg:text-sm text-gray-700 hover:border-orange-400 text-left transition flex items-center justify-between font-['Plus_Jakarta_Sans',sans-serif]"
        >
          <span>{selectedLabel}</span>
          <span ref={chevronRef} className="inline-block text-gray-400">
            <FaChevronDown className="text-xs" />
          </span>
        </button>
      </div>
      {dropdown}
    </div>
  );
}

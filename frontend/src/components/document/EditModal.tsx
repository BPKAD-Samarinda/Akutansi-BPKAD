import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FaChevronDown } from "react-icons/fa";
import { Calendar } from "../layout/ui/calendar";
import { Document } from "../../types";

interface EditModalProps {
  isOpen: boolean;
  document: Document | null;
  onClose: () => void;
  onSave: (id: number | string, updatedData: Partial<Document>) => void;
}

type EditFormData = {
  nama_sppd: string;
  kategori: "Lampiran" | "Keuangan" | "";
  tanggal_sppd: string;
};

export default function EditModal({
  isOpen,
  document: editingDocument,
  onClose,
  onSave,
}: EditModalProps) {
  const today = new Date().toISOString().split("T")[0];

  const toDateInputValue = (dateValue?: string) => {
    if (!dateValue) return today;

    const parsedDate = new Date(dateValue);
    if (Number.isNaN(parsedDate.getTime())) return today;

    return parsedDate.toISOString().split("T")[0];
  };

  const toDateObject = (dateValue: string) => {
    const parsedDate = new Date(dateValue);
    return Number.isNaN(parsedDate.getTime()) ? new Date(today) : parsedDate;
  };

  const fromDateToString = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDisplayDate = (dateValue: string) => {
    const parsedDate = toDateObject(dateValue);
    return parsedDate.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const createFormData = (doc: Document | null): EditFormData => ({
    nama_sppd: doc?.nama_sppd || "",
    kategori: (doc?.kategori as "Lampiran" | "Keuangan") || "",
    tanggal_sppd: toDateInputValue(doc?.tanggal_sppd),
  });

  const [formData, setFormData] = useState<EditFormData>(() =>
    createFormData(editingDocument),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen && !!editingDocument);
  const calendarPopoverRef = useRef<HTMLDivElement | null>(null);
  const calendarWrapperRef = useRef<HTMLDivElement | null>(null);
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);
  const categoryWrapperRef = useRef<HTMLDivElement | null>(null);
  const categoryChevronRef = useRef<HTMLSpanElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isCalendarOpen || !calendarPopoverRef.current) return;

    gsap.fromTo(
      calendarPopoverRef.current,
      { autoAlpha: 0, y: -8, scale: 0.98 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      },
    );
  }, [isCalendarOpen]);

  useEffect(() => {
    if (!isCategoryOpen || !categoryDropdownRef.current) return;

    gsap.fromTo(
      categoryDropdownRef.current,
      { autoAlpha: 0, y: -6, scale: 0.98 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.18,
        ease: "power2.out",
      },
    );
  }, [isCategoryOpen]);

  useEffect(() => {
    if (!categoryChevronRef.current) return;

    gsap.to(categoryChevronRef.current, {
      rotate: isCategoryOpen ? 180 : 0,
      duration: 0.18,
      ease: "power2.out",
    });
  }, [isCategoryOpen]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const targetNode = event.target as Node;

      if (
        isCategoryOpen &&
        categoryWrapperRef.current &&
        !categoryWrapperRef.current.contains(targetNode)
      ) {
        setIsCategoryOpen(false);
      }

      if (
        isCalendarOpen &&
        calendarWrapperRef.current &&
        !calendarWrapperRef.current.contains(targetNode)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isCategoryOpen, isCalendarOpen]);

  useEffect(() => {
    if (isOpen && editingDocument) {
      const frameId = requestAnimationFrame(() => {
        setShouldRender(true);
      });

      return () => cancelAnimationFrame(frameId);
    }
  }, [isOpen, editingDocument]);

  useEffect(() => {
    if (!shouldRender || !overlayRef.current || !modalRef.current) return;

    if (isOpen && editingDocument) {
      gsap.set(overlayRef.current, { autoAlpha: 0 });
      gsap.set(modalRef.current, { autoAlpha: 0, y: 12, scale: 0.98 });

      const openTimeline = gsap.timeline();
      openTimeline
        .to(overlayRef.current, {
          autoAlpha: 1,
          duration: 0.2,
          ease: "power2.out",
        })
        .to(
          modalRef.current,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.24,
            ease: "power2.out",
          },
          "<",
        );

      return () => {
        openTimeline.kill();
      };
    }

    const closeTimeline = gsap.timeline({
      onComplete: () => setShouldRender(false),
    });

    closeTimeline
      .to(modalRef.current, {
        autoAlpha: 0,
        y: 8,
        scale: 0.98,
        duration: 0.16,
        ease: "power2.in",
      })
      .to(
        overlayRef.current,
        {
          autoAlpha: 0,
          duration: 0.16,
          ease: "power2.in",
        },
        "<",
      );

    return () => {
      closeTimeline.kill();
    };
  }, [isOpen, editingDocument, shouldRender]);

  const handleCloseWithAnimation = () => {
    if (!overlayRef.current || !modalRef.current) {
      onClose();
      return;
    }

    const closeTimeline = gsap.timeline({ onComplete: onClose });
    closeTimeline
      .to(modalRef.current, {
        autoAlpha: 0,
        y: 8,
        scale: 0.98,
        duration: 0.16,
        ease: "power2.in",
      })
      .to(
        overlayRef.current,
        {
          autoAlpha: 0,
          duration: 0.16,
          ease: "power2.in",
        },
        "<",
      );
  };

  if (!shouldRender) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closeCategoryWithAnimation = () => {
    if (!categoryDropdownRef.current) {
      setIsCategoryOpen(false);
      return;
    }

    gsap.to(categoryDropdownRef.current, {
      autoAlpha: 0,
      y: -6,
      scale: 0.98,
      duration: 0.14,
      ease: "power2.in",
      onComplete: () => setIsCategoryOpen(false),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingDocument) return;
    if (!formData.kategori) return;

    onSave(editingDocument.id, {
      nama_sppd: formData.nama_sppd,
      kategori: formData.kategori,
      tanggal_sppd: formData.tanggal_sppd || today,
    });

    handleCloseWithAnimation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={handleCloseWithAnimation}
      />
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6"
      >
        <h2 className="text-xl font-bold mb-4">Edit Dokumen</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama SPPD */}
          <div>
            <label className="block text-sm font-medium mb-1">Nama SPPD</label>
            <input
              type="text"
              name="nama_sppd"
              value={formData.nama_sppd}
              onChange={handleChange}
              title="Nama SPPD"
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Kategori Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Kategori</label>
            <div ref={categoryWrapperRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  if (isCategoryOpen) {
                    closeCategoryWithAnimation();
                  } else {
                    setIsCategoryOpen(true);
                  }
                }}
                className="w-full border rounded-lg px-3 py-2 text-left bg-white flex items-center justify-between"
                title="Pilih Kategori"
              >
                <span
                  className={formData.kategori ? "text-black" : "text-gray-500"}
                >
                  {formData.kategori || "Pilih Kategori"}
                </span>
                <span
                  ref={categoryChevronRef}
                  className="inline-block text-gray-500"
                >
                  <FaChevronDown className="text-xs" />
                </span>
              </button>

              {isCategoryOpen && (
                <div
                  ref={categoryDropdownRef}
                  className="absolute top-full left-0 mt-2 z-20 w-full border rounded-lg bg-white shadow-lg p-1"
                >
                  {(["Lampiran", "Keuangan"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          kategori: option,
                        }));
                        closeCategoryWithAnimation();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${
                        formData.kategori === option
                          ? "bg-orange-50 text-orange-600"
                          : ""
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <div ref={calendarWrapperRef} className="relative">
              <button
                type="button"
                onClick={() => setIsCalendarOpen((prev) => !prev)}
                className="w-full border rounded-lg px-3 py-2 text-left bg-white"
              >
                {formatDisplayDate(formData.tanggal_sppd)}
              </button>

              {isCalendarOpen && (
                <div
                  ref={calendarPopoverRef}
                  className="absolute top-full left-0 mt-2 z-20 border rounded-lg bg-white shadow-lg p-2"
                >
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    fromYear={2000}
                    toYear={new Date().getFullYear() + 10}
                    selected={toDateObject(formData.tanggal_sppd)}
                    onSelect={(selectedDate) => {
                      if (!selectedDate) return;

                      setFormData((prev) => ({
                        ...prev,
                        tanggal_sppd: fromDateToString(selectedDate),
                      }));
                      setIsCalendarOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseWithAnimation}
              className="px-4 py-2 border rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

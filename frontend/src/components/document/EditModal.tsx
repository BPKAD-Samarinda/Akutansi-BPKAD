import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
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
  document,
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
    createFormData(document),
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarPopoverRef = useRef<HTMLDivElement | null>(null);

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

  if (!isOpen || !document) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave(document.id, {
      nama_sppd: formData.nama_sppd,
      kategori: formData.kategori,
      tanggal_sppd: formData.tanggal_sppd || today,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
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
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              title="Pilih Kategori"
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="Lampiran">Lampiran</option>
              <option value="Keuangan">Keuangan</option>
            </select>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <div className="relative">
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
              onClick={onClose}
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

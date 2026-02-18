import { useState } from "react";
import { Document } from "../../types";

interface EditModalProps {
  isOpen: boolean;
  document: Document | null;
  onClose: () => void;
  onSave: (id: number | string, updatedData: Partial<Document>) => void;
}

const convertToISODate = (dateStr: string): string => {
  const months: { [key: string]: string } = {
    Januari: "01",
    Februari: "02",
    Maret: "03",
    April: "04",
    Mei: "05",
    Juni: "06",
    Juli: "07",
    Agustus: "08",
    September: "09",
    Oktober: "10",
    November: "11",
    Desember: "12",
  };

  const parts = dateStr.split(" ");
  const day = parts[0].padStart(2, "0");
  const month = months[parts[1]];
  const year = parts[2];
  return `${year}-${month}-${day}`;
};

export default function EditModal({
  isOpen,
  document,
  onClose,
  onSave,
}: EditModalProps) {
  const [formData, setFormData] = useState({
    name: document?.name || "",
    date: document ? convertToISODate(document.date) : "",
    category: (document?.category || "") as "Lampiran" | "Keuangan" | "",
  });

  if (!isOpen || !document) return null;

  const handleInputChange = (
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

    // Convert date back to Indonesian format
    const dateObj = new Date(formData.date);
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const indonesianDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    onSave(document.id, {
      name: formData.name,
      date: indonesianDate,
      category: formData.category as "Lampiran" | "Keuangan" | undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl animate-[scaleIn_0.3s_ease-out]">
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Dokumen
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors duration-200"
                title="Tutup"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {/* Document Name */}
            <div className="group">
              <label
                htmlFor="edit-name"
                className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Nama Dokumen
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="relative w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 focus:outline-none focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div className="group">
              <label
                htmlFor="edit-date"
                className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Tanggal
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                <input
                  type="date"
                  id="edit-date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="relative w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 focus:outline-none focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="group">
              <label
                htmlFor="edit-category"
                className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide"
              >
                Kategori
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                <select
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="relative w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-orange-500 focus:outline-none focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Lampiran">Lampiran</option>
                  <option value="Keuangan">Keuangan</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Document Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Informasi Dokumen</p>
                  <p className="text-xs">
                    Format:{" "}
                    <span className="font-semibold">{document.format}</span>
                  </p>
                  <p className="text-xs">
                    Ukuran:{" "}
                    <span className="font-semibold">{document.size}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}</style>
    </div>
  );
}

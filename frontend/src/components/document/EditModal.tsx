import { useEffect, useState } from "react";
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

  const [formData, setFormData] = useState<EditFormData>({
    nama_sppd: "",
    kategori: "",
    tanggal_sppd: today,
  });

  useEffect(() => {
    if (document) {
      setFormData({
        nama_sppd: document.nama_sppd || "",
        kategori: (document.kategori as "Lampiran" | "Keuangan") || "",
        tanggal_sppd: document.tanggal_sppd || today,
      });
    }
  }, [document]);

  if (!isOpen || !document) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
            <label className="block text-sm font-medium mb-1">
              Nama SPPD
            </label>
            <input
              type="text"
              name="nama_sppd"
              value={formData.nama_sppd}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Kategori Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Kategori
            </label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              required
            >
              <option value="">Pilih Kategori</option>
              <option value="Lampiran">Lampiran</option>
              <option value="Keuangan">Keuangan</option>
            </select>
          </div>

          {/* Tanggal */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal
            </label>
            <input
              type="date"
              name="tanggal_sppd"
              value={formData.tanggal_sppd}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
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
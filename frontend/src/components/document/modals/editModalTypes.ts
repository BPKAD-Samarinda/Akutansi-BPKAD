import { Document } from "../../../types";

export type EditCategory = "Lampiran" | "Keuangan" | "";

export type EditFormData = {
  nama_sppd: string;
  kategori: EditCategory;
  tanggal_sppd: string;
};

export interface EditModalProps {
  isOpen: boolean;
  document: Document | null;
  onClose: () => void;
  onSave: (
    id: number | string,
    updatedData: Partial<Document>,
  ) => Promise<boolean>;
}

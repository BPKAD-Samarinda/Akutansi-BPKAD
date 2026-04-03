import { Document } from "../../../types";

export type EditCategory =
  | "Lampiran"
  | "Keuangan"
  | "BKU"
  | "STS"
  | "Rekening Koran"
  | "";

export type EditFormData = {
  nama_sppd: string;
  kategori: EditCategory;
  tanggal_sppd: string;
  file?: File | null;
  fileName?: string;
};

export interface EditModalProps {
  isOpen: boolean;
  document: Document | null;
  onClose: () => void;
  onSave: (
    id: number | string,
    updatedData: Partial<Document> & { file?: File | null },
  ) => Promise<boolean>;
}

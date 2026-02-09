export interface Document {
  id: number | string;
  name: string;
  format: string;
  size: string;
  date: string;
  file?: File | null;
  category?: "Lampiran" | "Keuangan";
}

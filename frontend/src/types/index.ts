export interface Document {
  id: number | string;
  name: string;
  format: string;
  size: string;
  date: string;
  file?: File | null;
  category?: "Lampiran" | "Keuangan";
}

export interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

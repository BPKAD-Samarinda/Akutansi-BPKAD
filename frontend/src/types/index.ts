export interface Document {
  id: number;
  nama_sppd: string;
  tanggal_sppd: string;
  kategori: string;
  file_path: string;
  created_at?: string;
}

export interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
}

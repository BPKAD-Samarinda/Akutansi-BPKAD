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

export interface UploadHistory {
  id: number | string;
  documentName: string;
  uploadedAt: string;
  uploadedBy: string;
  fileSize: string;
  filePath: string;
}

export interface UploadHistoryQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UploadHistoryResult {
  items: UploadHistory[];
  total: number;
  page: number;
  limit: number;
}

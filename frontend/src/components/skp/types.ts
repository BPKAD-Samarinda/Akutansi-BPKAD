export type UploadForm = {
  nama_skp: string;
  triwulan: number;
  tahun: number;
  file: File | null;
  target_user?: string;
};

export type EditForm = {
  id: number;
  nama_skp: string;
  triwulan: number;
  tahun: number;
  file_path: string;
  file: File | null;
  target_user?: string;
};

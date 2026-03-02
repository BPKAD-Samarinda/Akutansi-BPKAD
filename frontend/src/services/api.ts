import axios from "axios";
import {
  Document,
  UploadHistory,
  UploadHistoryQuery,
  UploadHistoryResult,
} from "../types";

export interface LoginResponse {
  message: string;
  token: string;
}

type DocumentApiItem = {
  id: number;
  nama_sppd: string;
  tanggal_sppd: string;
  kategori: string;
  file_path: string;
  created_at?: string;
};

type UploadHistoryApiItem = {
  id: number | string;
  document_name?: string;
  nama_sppd?: string;
  uploaded_at?: string;
  created_at?: string;
  uploaded_by?: string;
  uploader_name?: string;
  file_size?: string;
  size_label?: string;
  file_path?: string;
};

type UploadHistoryApiResponse =
  | UploadHistoryApiItem[]
  | {
      items?: UploadHistoryApiItem[];
      data?: UploadHistoryApiItem[];
      total?: number;
      page?: number;
      limit?: number;
    };

const apiClient = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const getDocuments = async (): Promise<Document[]> => {
  try {
    const response = await apiClient.get<DocumentApiItem[]>("/documents");

    return response.data.map((item) => ({
      id: item.id,
      nama_sppd: item.nama_sppd,
      tanggal_sppd: item.tanggal_sppd,
      kategori: item.kategori,
      file_path: item.file_path,
      created_at: item.created_at,
    }));
  } catch (error) {
    console.error("Terjadi kesalahan saat mengambil data dokumen:", error);
    return [];
  }
};

const toUploadHistory = (item: UploadHistoryApiItem): UploadHistory => ({
  id: item.id,
  documentName: item.document_name || item.nama_sppd || "Dokumen tanpa nama",
  uploadedAt: item.uploaded_at || item.created_at || "",
  uploadedBy: item.uploaded_by || item.uploader_name || "-",
  fileSize: item.file_size || item.size_label || "-",
  filePath: item.file_path || "",
});

export const getUploadHistories = async (
  query: UploadHistoryQuery = {},
): Promise<UploadHistoryResult> => {
  try {
    const response = await apiClient.get<UploadHistoryApiResponse>(
      "/documents/history",
      {
        params: {
          page: query.page,
          limit: query.limit,
          search: query.search,
        },
      },
    );

    const payload = response.data;

    if (Array.isArray(payload)) {
      return {
        items: payload.map(toUploadHistory),
        total: payload.length,
        page: query.page || 1,
        limit: query.limit || 10,
      };
    }

    const apiItems = payload.items || payload.data || [];

    return {
      items: apiItems.map(toUploadHistory),
      total: payload.total ?? apiItems.length,
      page: payload.page ?? query.page ?? 1,
      limit: payload.limit ?? query.limit ?? 10,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const fallback = await getDocuments();
      return {
        items: fallback.map((item) =>
          toUploadHistory({
            id: item.id,
            nama_sppd: item.nama_sppd,
            created_at: item.created_at,
            file_path: item.file_path,
          }),
        ),
        total: fallback.length,
        page: 1,
        limit: query.limit || 10,
      };
    }

    console.error("Terjadi kesalahan saat mengambil data riwayat:", error);
    return {
      items: [],
      total: 0,
      page: query.page || 1,
      limit: query.limit || 10,
    };
  }
};

export const restoreUploadHistory = async (
  id: number | string,
): Promise<{ message: string }> => {
  const response = await apiClient.post(`/documents/history/${id}/restore`);
  return response.data;
};

export const updateDocument = async (
  id: number | string,
  updatedData: Partial<Document>,
): Promise<void> => {
  await apiClient.put(`/documents/${id}`, updatedData);
};

export const login = async (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message || "Terjadi kesalahan saat mencoba login.",
      );
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
};

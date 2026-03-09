import axios from "axios";
import {
  Document,
  UploadHistory,
  UploadHistoryQuery,
  UploadHistoryResult,
} from "../types";
import { clearAuthToken, getAuthToken } from "../utils/auth";

export interface LoginResponse {
  message: string;
  token: string;
}

export interface DashboardApiDocument {
  id: number;
  nama_sppd: string | null;
  kategori: string;
  tanggal_sppd?: string | null;
  created_at?: string | null;
}

export interface DashboardApiLoginActivity {
  id: number;
  username: string;
  role: string;
  login_at: string;
}

export interface DashboardAnalyticsResponse {
  documents: DashboardApiDocument[];
  loginActivities: DashboardApiLoginActivity[];
  totalStaffUsers?: number;
}

type DocumentApiItem = {
  id: number;
  nama_sppd: string;
  tanggal_sppd: string;
  kategori: string;
  file_path: string;
  created_at?: string;
};

const apiClient = axios.create({
  baseURL:
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    "http://localhost:3001/api",
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearAuthToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

const resolvedBaseUrl = apiClient.defaults.baseURL?.replace(/\/+$/, "") ?? "";
const apiSuffix = "/api";
const serverOrigin = resolvedBaseUrl.endsWith(apiSuffix)
  ? resolvedBaseUrl.slice(0, -apiSuffix.length)
  : resolvedBaseUrl;

export const uploadsBaseUrl = `${serverOrigin}/uploads`;
export { apiClient };

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

export const getUploadHistories = async (
  query: UploadHistoryQuery = {},
): Promise<UploadHistoryResult> => {
  const page = Math.max(query.page || 1, 1);
  const limit = Math.max(query.limit || 10, 1);
  const search = (query.search || "").trim();
  const status = query.status || "all";

  if (status === "diunggah" || status === "diedit") {
    return {
      items: [],
      total: 0,
      page,
      limit,
    };
  }

  const response = await apiClient.get<{
    items: Array<{
      id: number | string;
      document_name: string;
      uploaded_at: string;
      uploaded_by: string;
      file_size: string;
      file_path: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }>("/documents/history", {
    params: {
      page,
      limit,
      search: search || undefined,
    },
  });

  const items: UploadHistory[] = response.data.items.map((item) => ({
    id: item.id,
    documentName: item.document_name,
    uploadedAt: item.uploaded_at || "",
    uploadedBy: item.uploaded_by || "-",
    fileSize: item.file_size || "-",
    filePath: item.file_path || "",
    status: "dihapus",
    isDeleted: true,
  }));

  return {
    items,
    total: response.data.total,
    page: response.data.page,
    limit: response.data.limit,
  };
};

export const restoreUploadHistory = async (
  id: number | string,
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    `/documents/history/${id}/restore`,
  );
  return { message: response.data.message || "Dokumen berhasil direstorasi." };
};

export const restoreUploadHistories = async (
  ids: Array<number | string>,
): Promise<{ message: string; restoredCount: number; failedCount: number }> => {
  let restoredCount = 0;
  let failedCount = 0;

  for (const id of ids) {
    const result = await restoreUploadHistory(id);
    if (result.message.toLowerCase().includes("berhasil")) {
      restoredCount += 1;
    } else {
      failedCount += 1;
    }
  }

  if (restoredCount === 0) {
    return {
      message: "Tidak ada dokumen yang berhasil direstorasi.",
      restoredCount,
      failedCount,
    };
  }

  if (failedCount > 0) {
    return {
      message: `${restoredCount} dokumen berhasil direstorasi, ${failedCount} gagal.`,
      restoredCount,
      failedCount,
    };
  }

  return {
    message: `${restoredCount} dokumen berhasil direstorasi.`,
    restoredCount,
    failedCount,
  };
};

export const permanentlyDeleteUploadHistory = async (
  id: number | string,
): Promise<{ message: string }> => {
  return {
    message: `Hapus permanen belum tersedia di backend untuk dokumen ${id}.`,
  };
};

export const updateDocument = async (
  id: number | string,
  updatedData: Partial<Document>,
): Promise<void> => {
  await apiClient.put(`/documents/${id}`, updatedData);
};

export const deleteDocument = async (id: number | string): Promise<void> => {
  await apiClient.delete(`/documents/${id}`);
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

export const getDashboardAnalytics = async (): Promise<DashboardAnalyticsResponse> => {
  const response = await apiClient.get<DashboardAnalyticsResponse>(
    "/dashboard/analytics",
    { params: { _t: Date.now() } },
  );
  return response.data;
};

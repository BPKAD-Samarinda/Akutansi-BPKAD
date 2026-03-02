import axios from "axios";
import {
  Document,
  UploadHistory,
  UploadHistoryQuery,
  UploadHistoryResult,
} from "../types";
import {
  getHiddenDocumentIds,
  getLocalUploadHistoryItems,
  getPermanentDeletedDocumentIds,
  permanentlyDeleteDocumentFromLocalHistory,
  restoreDocumentFromLocalHistory,
} from "../utils/uploadHistoryLocal";

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

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:3001/api",
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token =
    sessionStorage.getItem("authToken") ?? localStorage.getItem("authToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

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
  const searchText = (query.search || "").trim().toLowerCase();

  const documents = await getDocuments();
  const localHistoryItems = getLocalUploadHistoryItems();
  const hiddenIds = new Set(getHiddenDocumentIds().map(String));
  const permanentDeletedIds = new Set(
    getPermanentDeletedDocumentIds().map(String),
  );

  const localHistoryById = new Map<string, UploadHistory>();
  for (const historyItem of localHistoryItems) {
    localHistoryById.set(String(historyItem.id), historyItem);
  }

  const documentHistoryItems: UploadHistory[] = documents.map((document) => {
    const localHistory = localHistoryById.get(String(document.id));

    return {
      id: document.id,
      documentName: localHistory?.documentName || document.nama_sppd,
      uploadedAt:
        localHistory?.uploadedAt ||
        document.created_at ||
        document.tanggal_sppd ||
        "",
      uploadedBy: localHistory?.uploadedBy || "-",
      fileSize: localHistory?.fileSize || "-",
      filePath: localHistory?.filePath || document.file_path,
      isDeleted: hiddenIds.has(String(document.id)),
    };
  });

  const extraHistoryItems = localHistoryItems
    .filter(
      (historyItem) =>
        !documentHistoryItems.some(
          (documentItem) => String(documentItem.id) === String(historyItem.id),
        ),
    )
    .map((historyItem) => ({
      ...historyItem,
      isDeleted: hiddenIds.has(String(historyItem.id)),
    }));

  const allItems = [...documentHistoryItems, ...extraHistoryItems].sort(
    (itemA, itemB) => {
      const timeA = new Date(itemA.uploadedAt).getTime();
      const timeB = new Date(itemB.uploadedAt).getTime();

      return (
        (Number.isNaN(timeB) ? 0 : timeB) - (Number.isNaN(timeA) ? 0 : timeA)
      );
    },
  );

  const filteredItems =
    searchText.length === 0
      ? allItems.filter((item) => !permanentDeletedIds.has(String(item.id)))
      : allItems.filter(
          (item) =>
            item.documentName.toLowerCase().includes(searchText) &&
            !permanentDeletedIds.has(String(item.id)),
        );

  const total = filteredItems.length;
  const start = (page - 1) * limit;
  const items = filteredItems.slice(start, start + limit);

  return {
    items,
    total,
    page,
    limit,
  };
};

export const restoreUploadHistory = async (
  id: number | string,
): Promise<{ message: string }> => {
  const restored = restoreDocumentFromLocalHistory(id);

  if (!restored) {
    return { message: "Data riwayat tidak ditemukan." };
  }

  return { message: "Dokumen berhasil direstorasi." };
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
  const deleted = permanentlyDeleteDocumentFromLocalHistory(id);

  if (!deleted) {
    return { message: "Data riwayat tidak ditemukan." };
  }

  return { message: "Dokumen berhasil dihapus permanen." };
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

import { Document, UploadHistory } from "../types";

const HISTORY_STORAGE_KEY = "upload_history_local_items";
const HIDDEN_IDS_STORAGE_KEY = "upload_history_hidden_ids";
const PERMANENT_DELETED_IDS_STORAGE_KEY =
  "upload_history_permanent_deleted_ids";

const readJson = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) {
      return fallback;
    }

    const parsed = JSON.parse(rawValue);
    return parsed as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
};

const toUploadHistory = (document: Document): UploadHistory => ({
  id: document.id,
  documentName: document.nama_sppd,
  uploadedAt: document.created_at || document.tanggal_sppd || "",
  uploadedBy: document.uploaded_by || "-",
  fileSize: "-",
  filePath: document.file_path,
  document_date: document.tanggal_sppd,
});

export const getLocalUploadHistoryItems = (): UploadHistory[] => {
  return readJson<UploadHistory[]>(HISTORY_STORAGE_KEY, []);
};

export const setLocalUploadHistoryItems = (items: UploadHistory[]) => {
  writeJson(HISTORY_STORAGE_KEY, items);
};

export const getHiddenDocumentIds = (): Array<number | string> => {
  return readJson<Array<number | string>>(HIDDEN_IDS_STORAGE_KEY, []);
};

export const getPermanentDeletedDocumentIds = (): Array<number | string> => {
  return readJson<Array<number | string>>(
    PERMANENT_DELETED_IDS_STORAGE_KEY,
    [],
  );
};

const setHiddenDocumentIds = (ids: Array<number | string>) => {
  writeJson(HIDDEN_IDS_STORAGE_KEY, ids);
};

const setPermanentDeletedDocumentIds = (ids: Array<number | string>) => {
  writeJson(PERMANENT_DELETED_IDS_STORAGE_KEY, ids);
};

export const moveDocumentsToLocalHistory = (documents: Document[]) => {
  if (documents.length === 0) {
    return;
  }

  const historyItems = getLocalUploadHistoryItems();
  const hiddenIds = getHiddenDocumentIds();

  const historyById = new Map<string, UploadHistory>();
  for (const item of historyItems) {
    historyById.set(String(item.id), item);
  }

  for (const doc of documents) {
    historyById.set(String(doc.id), toUploadHistory(doc));
  }

  const nextHistory = Array.from(historyById.values());
  const nextHiddenIds = Array.from(
    new Set([
      ...hiddenIds.map(String),
      ...documents.map((doc) => String(doc.id)),
    ]),
  );

  setLocalUploadHistoryItems(nextHistory);
  setHiddenDocumentIds(nextHiddenIds);
};

export const restoreDocumentFromLocalHistory = (
  id: number | string,
): boolean => {
  const historyItems = getLocalUploadHistoryItems();
  const hiddenIds = getHiddenDocumentIds();
  const permanentDeletedIds = getPermanentDeletedDocumentIds();

  const stringId = String(id);
  if (permanentDeletedIds.some((itemId) => String(itemId) === stringId)) {
    return false;
  }

  const nextHistoryItems = historyItems.filter(
    (item) => String(item.id) !== stringId,
  );
  const nextHiddenIds = hiddenIds.filter(
    (hiddenId) => String(hiddenId) !== stringId,
  );

  const hasChanged =
    nextHistoryItems.length !== historyItems.length ||
    nextHiddenIds.length !== hiddenIds.length;

  if (!hasChanged) {
    return false;
  }

  setLocalUploadHistoryItems(nextHistoryItems);
  setHiddenDocumentIds(nextHiddenIds);

  return true;
};

export const permanentlyDeleteDocumentFromLocalHistory = (
  id: number | string,
): boolean => {
  const stringId = String(id);
  const historyItems = getLocalUploadHistoryItems();
  const hiddenIds = getHiddenDocumentIds();
  const permanentDeletedIds = getPermanentDeletedDocumentIds();

  const nextHistoryItems = historyItems.filter(
    (item) => String(item.id) !== stringId,
  );
  const nextHiddenIds = Array.from(
    new Set([...hiddenIds.map(String), stringId]),
  );
  const nextPermanentDeletedIds = Array.from(
    new Set([...permanentDeletedIds.map(String), stringId]),
  );

  const hasChanged =
    nextHistoryItems.length !== historyItems.length ||
    nextHiddenIds.length !== hiddenIds.length ||
    nextPermanentDeletedIds.length !== permanentDeletedIds.length;

  if (!hasChanged) {
    return false;
  }

  setLocalUploadHistoryItems(nextHistoryItems);
  setHiddenDocumentIds(nextHiddenIds);
  setPermanentDeletedDocumentIds(nextPermanentDeletedIds);

  return true;
};

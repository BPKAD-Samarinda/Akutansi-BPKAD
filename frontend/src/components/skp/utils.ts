import { uploadsBaseUrl } from "../../services/api";

export const getFileNameFromPath = (value: string) => {
  if (!value) return "";
  const normalized = value.replace(/\\/g, "/");
  return normalized.split("/").pop() || value;
};

export const buildFileUrl = (filePath: string) => {
  const normalized = String(filePath || "").trim().replace(/\\/g, "/").replace(/^\/+/, "");
  const relative = normalized.replace(/^uploads\//i, "");
  return `${uploadsBaseUrl}/${relative}`;
};

export const openFileInNewTab = (filePath: string) => {
  window.open(buildFileUrl(filePath), "_blank", "noopener,noreferrer");
};

export const downloadFile = (filePath: string) => {
  const link = document.createElement("a");
  link.href = buildFileUrl(filePath);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.download = getFileNameFromPath(filePath) || "dokumen-skp";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

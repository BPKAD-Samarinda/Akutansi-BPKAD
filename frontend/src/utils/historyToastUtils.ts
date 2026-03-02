import { ToastState } from "../types";

export const getRestoreToastType = (message: string): ToastState["type"] => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("berhasil")) {
    return "success";
  }

  if (normalizedMessage.includes("belum tersedia")) {
    return "warning";
  }

  if (normalizedMessage.includes("tidak ditemukan")) {
    return "warning";
  }

  return "error";
};

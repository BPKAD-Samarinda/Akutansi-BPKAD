import { Document } from "../../../types";
import { EditFormData, EditCategory } from "./editModalTypes";

export const toDateInputValue = (
  dateValue: string | undefined,
  today: string,
) => {
  if (!dateValue) return today;

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return today;

  return parsedDate.toISOString().split("T")[0];
};

export const toDateObject = (dateValue: string, today: string) => {
  const parsedDate = new Date(dateValue);
  return Number.isNaN(parsedDate.getTime()) ? new Date(today) : parsedDate;
};

export const fromDateToString = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const formatDisplayDate = (dateValue: string, today: string) => {
  const parsedDate = toDateObject(dateValue, today);
  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const createEditFormData = (
  doc: Document | null,
  today: string,
): EditFormData => ({
  nama_sppd: doc?.nama_sppd || "",
  kategori: (doc?.kategori as EditCategory) || "",
  tanggal_sppd: toDateInputValue(doc?.tanggal_sppd, today),
});

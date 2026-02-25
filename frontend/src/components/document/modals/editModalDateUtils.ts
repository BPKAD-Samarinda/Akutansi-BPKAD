import { Document } from "../../../types";
import { EditFormData, EditCategory } from "./editModalTypes";

const pad2 = (value: number) => String(value).padStart(2, "0");

const toLocalDateString = (date: Date) => {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

const parseDateValue = (dateValue: string) => {
  const dateOnlyMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    const localDate = new Date(Number(year), Number(month) - 1, Number(day));
    if (!Number.isNaN(localDate.getTime())) {
      return localDate;
    }
  }

  const normalizedDateValue = dateValue.includes(" ")
    ? dateValue.replace(" ", "T")
    : dateValue;

  const parsedDate = new Date(normalizedDateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

export const toDateInputValue = (
  dateValue: string | undefined,
  today: string,
) => {
  if (!dateValue) return today;

  const parsedDate = parseDateValue(dateValue);
  if (!parsedDate) return today;

  return toLocalDateString(parsedDate);
};

export const toDateObject = (dateValue: string, today: string) => {
  const parsedDate = parseDateValue(dateValue);
  if (parsedDate) {
    return parsedDate;
  }

  return parseDateValue(today) ?? new Date();
};

export const fromDateToString = (date: Date) => {
  return toLocalDateString(date);
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

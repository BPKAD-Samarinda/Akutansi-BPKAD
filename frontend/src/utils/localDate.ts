const pad2 = (value: number) => String(value).padStart(2, "0");

export const toLocalDateOnly = (value: string): string => {
  const raw = (value || "").trim();
  if (!raw) return "";

  // Format murni YYYY-MM-DD -> aman, langsung pakai apa adanya.
  const exactDateOnly = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (exactDateOnly) {
    return `${exactDateOnly[1]}-${exactDateOnly[2]}-${exactDateOnly[3]}`;
  }

  // Format yang diawali YYYY-MM-DD tapi ada jam
  const startsWithDate = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (startsWithDate && !raw.includes("T") && !raw.endsWith("Z")) {
    return `${startsWithDate[1]}-${startsWithDate[2]}-${startsWithDate[3]}`;
  }

  // ISO/UTC -> konversi ke local date biar tidak geser 1 hari.
  const parsed = new Date(raw.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    return startsWithDate
      ? `${startsWithDate[1]}-${startsWithDate[2]}-${startsWithDate[3]}`
      : "";
  }

  return `${parsed.getFullYear()}-${pad2(parsed.getMonth() + 1)}-${pad2(parsed.getDate())}`;
};

export const formatIndonesianDate = (value: string): string => {
  const dateOnly = toLocalDateOnly(value);
  const [year, month, day] = dateOnly.split("-").map(Number);

  if (!year || !month || !day) return value || "-";

  return new Date(year, month - 1, day).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};


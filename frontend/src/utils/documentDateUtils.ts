const MONTHS_TO_NUMBER: Record<string, string> = {
  Januari: "01",
  Februari: "02",
  Maret: "03",
  April: "04",
  Mei: "05",
  Juni: "06",
  Juli: "07",
  Agustus: "08",
  September: "09",
  Oktober: "10",
  November: "11",
  Desember: "12",
};

const MONTHS_INDO = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export const indonesianDateToISO = (dateStr: string): string => {
  const parts = dateStr.split(" ");

  if (parts.length !== 3) {
    return "";
  }

  const day = parts[0].padStart(2, "0");
  const month = MONTHS_TO_NUMBER[parts[1]];
  const year = parts[2];

  if (!month) {
    return "";
  }

  return `${year}-${month}-${day}`;
};

export const isoDateToIndonesian = (isoDate: string): string => {
  const dateObj = new Date(isoDate);

  if (Number.isNaN(dateObj.getTime())) {
    return "";
  }

  return `${dateObj.getDate()} ${MONTHS_INDO[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
};

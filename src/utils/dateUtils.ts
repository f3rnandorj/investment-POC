function convertToISODate(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/").map(Number);

  const isoString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const date = new Date(isoString);
  
  return date;
}

export const dateUtils = {
  convertToISODate
};
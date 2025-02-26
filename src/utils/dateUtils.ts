function convertToISODate(dateStr: string | Date): Date | string {
  if (dateStr instanceof Date) {
    return dateStr.toLocaleDateString("pt-BR");
  }

  const [day, month, year] = dateStr.split("/").map(Number);
  if (!day || !month || !year) throw new Error("Data inválida!");

  return new Date(year, month - 1, day); 
}

export const dateUtils = {
  convertToISODate
};

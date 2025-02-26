import { format } from "date-fns";
import { get as isBusinessDay } from "is-business-day";

function convertToISODate(dateStr: string | Date): Date | string {
  if (dateStr instanceof Date) {
    return dateStr.toLocaleDateString("pt-BR");
  }

  const [day, month, year] = dateStr.split("/").map(Number);
  if (!day || !month || !year) throw new Error("Data inválida!");

  return new Date(year, month - 1, day); 
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * (timestamp < 1e12 ? 1000 : 1));
  return format(date, "dd/MM/yyyy");
}

function removeNotBusinessDays<T>(dataArray: T[], dateKey: keyof T): T[] {
  return dataArray.filter((item) => {
    const dateStr = item[dateKey] as unknown as string;
    const date = new Date(dateStr);

    return isBusinessDay(date, "America/Sao_Paulo");
  });
}

export const dateUtils = {
  convertToISODate,
  formatTimestamp,
  removeNotBusinessDays
};

import { format } from "date-fns";

/**
 * Converte uma data para um formato específico dependendo do tipo de entrada.
 *
 *  Possíveis entradas:
 *   - String no formato "DD/MM/AAAA" (ex: "25/02/2025")
 *   - Objeto Date (ex: new Date(2025, 1, 25))
 *
 *  Possíveis saídas:
 *   - Se a entrada for um objeto Date, retorna uma string no formato "DD/MM/AAAA".
 *   - Se a entrada for uma string "DD/MM/AAAA", retorna um objeto Date correspondente.
 *
 * ⚠️ Lança um erro se a string de data for inválida ou mal formatada.
 */
function convertToISODate(dateStr: string | Date): Date | string {
  if (dateStr instanceof Date) {
    return dateStr.toLocaleDateString("pt-BR");
  }

  const [day, month, year] = dateStr.split("/").map(Number);
  if (!day || !month || !year) throw new Error("Data inválida!");

  const date = new Date(year, month - 1, day); 

  return date;

  //  return date.toISOString()
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * (timestamp < 1e12 ? 1000 : 1));
  return format(date, "dd/MM/yyyy");
}

type DateFilterParams<T> = {
  array: T[];
  startDate: Date;
  endDate: Date;
  filterUndefinedField?: keyof T; 
};

function filterArrayByDate<T extends { date: Date }>({
  array,
  startDate,
  endDate,
  filterUndefinedField,
}: DateFilterParams<T>): T[] {
  return array
    .filter((entry) => {
      const isWithinDateRange = entry.date >= startDate && entry.date <= endDate;
      const isDefined = filterUndefinedField ? entry[filterUndefinedField] !== undefined : true;
      return isWithinDateRange && isDefined;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export const dateUtils = {
  convertToISODate,
  formatTimestamp,
  filterArrayByDate,
};

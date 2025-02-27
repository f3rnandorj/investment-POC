import { format } from "date-fns";
import { get as isBusinessDay } from "is-business-day";

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

  return new Date(year, month - 1, day); 
}

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * (timestamp < 1e12 ? 1000 : 1));
  return format(date, "dd/MM/yyyy");
}

function removeNotBusinessDays<T>(dataArray: T[], dateKey: keyof T): T[] {
  return dataArray.filter((item) => {
    const dateValue = item[dateKey];

    // Verifica se o valor é uma string e converte para Date
    const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error(`O valor em ${String(dateKey)} não é uma data válida.`);
    }

    return isBusinessDay(date, "America/Sao_Paulo");
  });
}

export const dateUtils = {
  convertToISODate,
  formatTimestamp,
  removeNotBusinessDays,
};

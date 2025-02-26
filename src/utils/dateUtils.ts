import { format } from "date-fns";

function convertToISODate(dateStr: string | Date): Date | string {
  if (dateStr instanceof Date) {
    return dateStr.toLocaleDateString("pt-BR");
  }

  const [day, month, year] = dateStr.split("/").map(Number);
  if (!day || !month || !year) throw new Error("Data inválida!");

  return new Date(year, month - 1, day); 
}

function formatTimestamp(timestamp: number): string {
  // Se o timestamp estiver em segundos, converte para milissegundos
  const date = new Date(timestamp * (timestamp < 1e12 ? 1000 : 1));
  return format(date, "dd/MM/yyyy");
}

export const dateUtils = {
  convertToISODate,
  formatTimestamp
};

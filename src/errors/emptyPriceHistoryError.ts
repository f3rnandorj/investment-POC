export class EmptyPriceHistoryError extends Error {
  constructor() {
    super("Histórico de preços do ativo está vazio.");
  }
}
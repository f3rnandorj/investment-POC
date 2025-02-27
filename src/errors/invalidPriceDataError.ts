export class InvalidPriceDataError extends Error {
  constructor() {
    super("Dados de preço inválidos.");
  }
}
export class CDIRateNotFoundError extends Error {
  constructor() {
    super("Nenhuma taxa CDI encontrada no período.");
  }
}
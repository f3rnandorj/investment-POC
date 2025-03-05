export class DateIntervalTooShortError extends Error {
  constructor() {
    super("O intervalo de datas deve ser de pelo menos dois dias.");
  }
}

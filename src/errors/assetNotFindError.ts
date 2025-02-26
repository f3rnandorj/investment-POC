export class AssetNotFindError extends Error {
  constructor() {
    super("Ativo não encontrado");
  }
}
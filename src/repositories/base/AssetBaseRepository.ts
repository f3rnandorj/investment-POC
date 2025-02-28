import { Asset, Prisma } from "@prisma/client";

export interface AssetBaseRepository {
  getBySymbol: (symbol: string) => Promise<Asset | null>;
  getManyBySymbol: (symbols: string[]) => Promise<Asset[]>;
  create: (data: Prisma.AssetCreateInput) => Promise<Asset>
}
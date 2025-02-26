import { Asset } from "@prisma/client";

export interface AssetBaseRepository {
  getBySymbol: (symbol: string) => Promise<Asset | null>
}
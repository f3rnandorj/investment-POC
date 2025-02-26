import { prisma } from "@/lib/prisma";
import { AssetBaseRepository } from "../base/AssetBaseRepository";
import { Asset } from "@prisma/client";

export class PrismaAssetRepository implements AssetBaseRepository {
  async getManyBySymbol(symbols: string[]): Promise<Asset[]> {
    const assets = await prisma.asset.findMany({
      where: { symbol: { in: symbols } }, 
    });
  
    return assets.length > 0 ? assets : []; 
  }

  async getBySymbol (symbol: string): Promise<Asset | null> {
    const asset = await prisma.asset.findUnique({
      where: { symbol },
    });

    return asset;
  };

}
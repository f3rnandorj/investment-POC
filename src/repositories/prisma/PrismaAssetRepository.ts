import { prisma } from "@/lib/prisma";
import { AssetBaseRepository } from "../base/AssetBaseRepository";
import { Asset } from "@prisma/client";

export class PrismaAssetRepository implements AssetBaseRepository {
  async getBySymbol (symbol: string): Promise<Asset | null> {
    const asset = await prisma.asset.findUnique({
      where: { symbol },
    });

    return asset;
  };

}
import { prisma } from "@/lib/prisma";
import { AssetInfoBaseRepository } from "../base/AssetInfoBaseRepository";
import { AssetInfo } from "@prisma/client";

export class PrismaAssetInfoRepository implements AssetInfoBaseRepository {
  async getAll(): Promise<AssetInfo[]> {
    return await prisma.assetInfo.findMany();
  }
}
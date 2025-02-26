import { prisma } from "@/lib/prisma";
import { AssetInfoBaseRepository } from "../base/AssetInfoBaseRepository";

export class PrismaAssetInfoRepository implements AssetInfoBaseRepository {
  async getAll() {
    return await prisma.assetInfo.findMany();
  }
}
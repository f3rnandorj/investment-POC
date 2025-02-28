import { prisma } from "@/lib/prisma";
import { AssetInfoBaseRepository } from "../base/AssetInfoBaseRepository";
import { AssetInfo, Prisma } from "@prisma/client";

export class PrismaAssetInfoRepository implements AssetInfoBaseRepository {
  async create(data: Prisma.AssetInfoCreateInput): Promise<AssetInfo> {

    return await prisma.assetInfo.create({ data });
  }

  async getAll(): Promise<AssetInfo[]> {
    return await prisma.assetInfo.findMany();
  }
}
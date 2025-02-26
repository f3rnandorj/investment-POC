import { prisma } from "@/lib/prisma";
import { AssetInfosRepository } from "../AssetInfosRepository";

export class PrismaAssetInfosRepository implements AssetInfosRepository {
  async getAll() {
    return await prisma.assetInfo.findMany();
  }
}
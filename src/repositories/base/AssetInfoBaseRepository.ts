import { AssetInfo, Prisma } from "@prisma/client";

export interface AssetInfoBaseRepository {
  getAll: () => Promise<AssetInfo[]>
  create: (data: Prisma.AssetInfoCreateInput) => Promise<AssetInfo>
}
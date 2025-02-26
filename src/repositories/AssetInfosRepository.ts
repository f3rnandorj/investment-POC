import { AssetInfo } from "@prisma/client";

export interface AssetInfosRepository {
  getAll: () => Promise<AssetInfo[]>
}
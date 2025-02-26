import { AssetInfo } from "@prisma/client";

export interface AssetInfoBaseRepository {
  getAll: () => Promise<AssetInfo[]>
}
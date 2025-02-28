import { AssetInfoBaseRepository } from "../base/AssetInfoBaseRepository";
import { AssetInfo, Prisma } from "@prisma/client";

export class InMemoryAssetInfoRepository implements AssetInfoBaseRepository {
  public items: AssetInfo[] = [];
  
  async create(data: Prisma.AssetInfoCreateInput): Promise<AssetInfo> {
    const assetInfo: AssetInfo = {
      ...data,
      id: this.items.length,
    };

    this.items.push(assetInfo);

    return assetInfo;
  }

  async getAll() {
    return this.items;
  }
}
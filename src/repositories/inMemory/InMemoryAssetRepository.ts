import { AssetBaseRepository } from "../base/AssetBaseRepository";
import { Asset, Prisma } from "@prisma/client";

export class InMemoryAssetRepository implements AssetBaseRepository {
  private items: Asset[] = [];
  
  async create(data: Prisma.AssetCreateInput): Promise<Asset> {
    const asset: Asset = {
      ...data,
      previous_close: data.previous_close ?? 0,
      price_history: JSON.stringify(data.price_history),
      id: this.items.length,
    };
    
    this.items.push(asset);
    
    return asset;
  }

  async getManyBySymbol(symbols: string[]) {
    const assets = this.items.filter((asset) => symbols.includes(asset.symbol));
    return assets.length > 0 ? assets : [];
  }

  async getBySymbol(symbol: string) {
    return this.items.find((asset) => asset.symbol === symbol) || null;
  }

}
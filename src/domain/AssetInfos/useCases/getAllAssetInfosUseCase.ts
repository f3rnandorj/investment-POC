import { AssetInfosRepository } from "@/repositories/AssetInfosRepository";

export class GetAllAssetInfosUseCase {
  constructor(private assetInfosRepository: AssetInfosRepository) {}

  async execute() {
    const assets = await this.assetInfosRepository.getAll();
  
    const data = assets.map((asset) => ({
      asset_code: asset.asset_code,
      category: asset.category,
      tag: asset.tag
    }));
    
    return data;
  }
}
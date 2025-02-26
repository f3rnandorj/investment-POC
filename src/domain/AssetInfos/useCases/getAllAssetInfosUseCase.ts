import { AssetInfoBaseRepository } from "@/repositories";

export class GetAllAssetInfosUseCase {
  constructor(private assetInfoRepository: AssetInfoBaseRepository) {}

  async execute() {
    const assets = await this.assetInfoRepository.getAll();
  
    const data = assets.map((asset) => ({
      asset_code: asset.asset_code,
      category: asset.category,
      tag: asset.tag
    }));
    
    return data;
  }
}
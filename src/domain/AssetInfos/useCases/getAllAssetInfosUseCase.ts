import { AssetInfoBaseRepository } from "@/repositories";

export class GetAllAssetInfosUseCase {
  constructor(private assetInfoRepository: AssetInfoBaseRepository) {}

  async execute() {
    const assets = await this.assetInfoRepository.getAll();
  
    const data = assets.map((asset) => ({
      codigoAtivo: asset.asset_code,
      classe: asset.category,
      etiqueta: asset.tag
    }));
    
    return data;
  }
}
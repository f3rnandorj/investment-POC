import { AssetNotFindError } from "@/errors";
import { AssetBaseRepository, CDIBaseRepository } from "@/repositories";
import { dateUtils } from "@/utils";

interface PriceHistory {
  timestamp: number;
  open_price?: number;
  high_price?: number;
  low_price?: number;
  close_price?: number;
  volume?: number;
}

export class GetAssetPriceHistoryUseCase {
  constructor(
    private assetRepository: AssetBaseRepository, 
  ) {}

  async execute(ticker: string) {
    const asset = await this.assetRepository.getBySymbol(ticker);
  
    if (!asset || typeof asset?.price_history !== "string") {
      throw new AssetNotFindError();
    }
    
    const priceHistory: PriceHistory[] = JSON.parse(asset.price_history);
  
    const priceHistoryFiltered = dateUtils.removeNotBusinessDays(priceHistory
      .map((assetPrice) => ({
        date: dateUtils.formatTimestamp(assetPrice.timestamp),
        close_price: assetPrice.close_price,
      })), "date");
  
    const data = {
      ticker: asset.symbol,
      name: asset.long_name,
      priceHistory: priceHistoryFiltered,
    };
  
    return data;
  }
  
}
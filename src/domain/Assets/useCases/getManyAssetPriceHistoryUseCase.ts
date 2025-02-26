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

export class GetManyAssetPriceHistoryUseCase {
  constructor(
    private assetRepository: AssetBaseRepository, 
  ) {}

  async execute(tickers: string[]) {
    const assets = await this.assetRepository.getManyBySymbol(tickers);
  
    const data = assets.map((asset) => {
      if (!assets || typeof asset?.price_history !== "string") {
        throw new AssetNotFindError();
      }

      const priceHistory: PriceHistory[] = JSON.parse(asset.price_history);

      const priceHistoryFiltered = dateUtils.removeNotBusinessDays(priceHistory
        .map((assetPrice) => ({
          date: dateUtils.formatTimestamp(assetPrice.timestamp),
          close_price: assetPrice.close_price,
        })), "date");

      return {
        ticker: asset.symbol,
        name: asset.long_name,
        priceHistory: priceHistoryFiltered,
      };
    });
  
    return data;
  }
  
}
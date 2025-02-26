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
    private CDIRepository: CDIBaseRepository
  ) {}

  async execute(ticker: string) {
    const asset = await this.assetRepository.getBySymbol(ticker);
  
    if (!asset || typeof asset?.priceHistory !== "string") {
      throw new AssetNotFindError();
    }
  
    const cdiHistory = await this.CDIRepository.getAll();
    
    const priceHistory: PriceHistory[] = JSON.parse(asset.priceHistory);
  
    const priceHistoryFiltered = dateUtils.removeNotBusinessDays(priceHistory
      .map((assetPrice) => ({
        date: dateUtils.formatTimestamp(assetPrice.timestamp),
        close_price: assetPrice.close_price,
      })), "date");
  
    const cdiHistoryFiltered = dateUtils.removeNotBusinessDays(cdiHistory
      .map((cdiPrice) => ({
        date: dateUtils.convertToISODate(cdiPrice.date),
        close_price: cdiPrice.rate,
      })), "date");
  
    const data = {
      ticker: asset.symbol,
      name: asset.long_name,
      priceHistory: priceHistoryFiltered,
      cdiHistory: cdiHistoryFiltered,
    };
  
    return data;
  }
  
}
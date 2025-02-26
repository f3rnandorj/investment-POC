import { AssetNotFindError } from "@/errors";
import { AssetBaseRepository } from "@/repositories";
import { dateUtils } from "@/utils";
import { PriceHistory } from "../AssetTypes";

interface GetAssetPriceHistoryUseCaseRequest {
  ticker: string;
  startDate?: string;
  endDate?: string;
}

interface GetAssetPriceHistoryUseCaseResponse {
  ticker: string;
  name: string;
  priceHistory: {
      date: string;
      close_price: number | undefined;
  }[];
};

export class GetAssetPriceHistoryUseCase {
  constructor(
    private assetRepository: AssetBaseRepository, 
  ) {}

  async execute({ ticker,endDate, startDate }: GetAssetPriceHistoryUseCaseRequest): Promise<GetAssetPriceHistoryUseCaseResponse> {
    const asset = await this.assetRepository.getBySymbol(ticker);
  
    if (!asset || typeof asset?.price_history !== "string") {
      throw new AssetNotFindError();
    }
    
    const priceHistory: PriceHistory[] = JSON.parse(asset.price_history);

    const priceHistoryFiltered = dateUtils.removeNotBusinessDays(
      priceHistory
        .map((assetPrice) => ({
          date: dateUtils.formatTimestamp(assetPrice.timestamp),
          close_price: assetPrice.close_price,
        }))
        .filter((item) => {
          const date = dateUtils.convertToISODate(item.date);
          return (
            (!startDate || date >= new Date(startDate)) &&
              (!endDate || date <= new Date(endDate))
          );
        }),
      "date"
    );
  
    const data = {
      ticker: asset.symbol,
      name: asset.long_name,
      priceHistory: priceHistoryFiltered,
    };
  
    return data;
  }
  
}
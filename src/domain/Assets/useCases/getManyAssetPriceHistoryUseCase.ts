import { AssetNotFindError } from "@/errors";
import { AssetBaseRepository } from "@/repositories";
import { dateUtils } from "@/utils";
import { PriceHistory } from "../AssetTypes";

interface GetManyAssetPriceHistoryUseCaseRequest {
  tickers: string[];
  startDate?: string;
  endDate?: string;
}

interface GetManyAssetPriceHistoryUseCaseResponse {
  ticker: string;
  name: string;
  priceHistory: {
      date: string;
      close_price: number | undefined;
  }[];
};

export class GetManyAssetPriceHistoryUseCase {
  constructor(
    private assetRepository: AssetBaseRepository,
  ) {}

  async execute({ tickers,endDate,startDate }:GetManyAssetPriceHistoryUseCaseRequest): Promise<GetManyAssetPriceHistoryUseCaseResponse[]> {
    const assets = await this.assetRepository.getManyBySymbol(tickers);

    const data = assets.map((asset) => {
      if (!assets || typeof asset?.price_history !== "string") {
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

      return {
        ticker: asset.symbol,
        name: asset.long_name,
        priceHistory: priceHistoryFiltered,
      };
    });

    return data;
  }
}

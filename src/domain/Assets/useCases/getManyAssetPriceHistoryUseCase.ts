import { AssetNotFindError } from "@/errors";
import { AssetBaseRepository, CDIBaseRepository } from "@/repositories";
import { dateUtils, moneyUtils, stringUtils } from "@/utils";
import { PriceHistory } from "../AssetTypes";

interface GetManyAssetPriceHistoryUseCaseRequest {
  tickers: string[];
  startDate?: string;
  endDate?: string;
}

export type ReturnProfitabilityData = {
  date: Date;
  accumulated_return: number;
}[];
interface GetManyAssetPriceHistoryUseCaseResponse {
  [ticker: string] : {
    tickerReturns: ReturnProfitabilityData;
    cdiReturns: ReturnProfitabilityData;
  }
};

export class GetManyAssetPriceHistoryUseCase {
  constructor(
    private assetRepository: AssetBaseRepository,
    private CDIRepository: CDIBaseRepository, 
  ) {}

  async execute({ tickers, endDate, startDate }:GetManyAssetPriceHistoryUseCaseRequest): Promise<GetManyAssetPriceHistoryUseCaseResponse[]> {
    const { removeNotBusinessDays, convertToISODate } = dateUtils;

    const startDateFormatted = startDate ? convertToISODate(startDate) as Date : null;
    const endDateFormatted = endDate ? convertToISODate(endDate) as Date : null;

    const assets = await this.assetRepository.getManyBySymbol(tickers);

    const CDIPriceHistory = await this.CDIRepository.getAll();

    const data = assets.map((asset) => {
      if (!assets || typeof asset?.price_history !== "string") {
        throw new AssetNotFindError();
      }

      const tickerName = stringUtils.getStringBeforeDot(asset.symbol);

      const priceHistory: PriceHistory[] = JSON.parse(asset.price_history);

      const priceHistoryFiltered = dateUtils.removeNotBusinessDays(
        priceHistory
          .map((assetPrice) => ({
            date: new Date(assetPrice.date),
            close_price: assetPrice.close_price,
          })),
        "date"
      );

      const start = startDateFormatted ? startDateFormatted : priceHistoryFiltered[0].date;
      const end = endDateFormatted ? endDateFormatted : priceHistoryFiltered[priceHistoryFiltered.length -1].date;

      const data = moneyUtils.calculateReturns(priceHistoryFiltered, CDIPriceHistory, start, end);

      return { [tickerName]: data };
    });

    return data;
  }
}

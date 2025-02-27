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
  profitabilityDay: number;
}[];
interface GetManyAssetPriceHistoryUseCaseResponse {
  [ticker: string] : {
    tickerProfitability: ReturnProfitabilityData;
    cdiProfitability: ReturnProfitabilityData;
  }
};

export class GetManyAssetPriceHistoryUseCase {
  constructor(
    private assetRepository: AssetBaseRepository,
    private CDIRepository: CDIBaseRepository, 
  ) {}

  async execute({ tickers, endDate, startDate }:GetManyAssetPriceHistoryUseCaseRequest): Promise<GetManyAssetPriceHistoryUseCaseResponse[]> {
    const { removeNotBusinessDays, convertToISODate, filterArrayByDate } = dateUtils;
    const { calculateDailyProfitability, calculateCDIProfitability } = moneyUtils;

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

      const priceHistoryFiltered = removeNotBusinessDays(
        priceHistory
          .map((assetPrice) => ({
            date: new Date(assetPrice.date),
            close_price: assetPrice.close_price,
          })),
        "date"
      );

      const start = startDateFormatted ? startDateFormatted : priceHistoryFiltered[0].date;
      const end = endDateFormatted ? endDateFormatted : priceHistoryFiltered[priceHistoryFiltered.length -1].date;

      const priceHistoryFilteredByDate = filterArrayByDate({
        array: priceHistoryFiltered,
        startDate: start,
        endDate: end,
        filterUndefinedField: "close_price",
      });
      
      const CDIHistoryFilteredByDate = filterArrayByDate({
        array: CDIPriceHistory || [],
        startDate: start,
        endDate: end,
      });

      const formattedData = {
        tickerProfitability: priceHistoryFilteredByDate
          .map((asset, index, array) => {
            const profitabilityDay = calculateDailyProfitability(
              { 
                price: asset.close_price,
                previousPrice: index > 0 ? array[index - 1].close_price : undefined, 
              }
            );
      
            return profitabilityDay !== null
              ? { date: asset.date, profitabilityDay }
              : null; 
          })
          .filter((item) => item !== null),
  
        cdiProfitability: CDIHistoryFilteredByDate.map((cdi) => ({
          date: cdi.date,
          profitabilityDay: calculateCDIProfitability(cdi.rate)
        }))
      };

      return { [tickerName]: formattedData };
    });

    return data;
  }
}

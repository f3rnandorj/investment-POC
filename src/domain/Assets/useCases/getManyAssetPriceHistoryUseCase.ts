import { AssetNotFindError } from "@/errors";
import { AssetBaseRepository, CDIBaseRepository } from "@/repositories";
import { AssetWithWeight, dateUtils, moneyUtils, stringUtils } from "@/utils";
import { PriceHistory } from "../AssetTypes";

interface GetManyAssetPriceHistoryUseCaseRequest {
  assets: {
    ticker: string;
    weight: string;
  }[];
  startDate?: string;
  endDate?: string;
}

type ReturnProfitabilityData = {
  date: Date;
  profitabilityDay: number;
}[];
interface GetManyAssetPriceHistoryUseCaseResponse {
  portfolioProfitability: ReturnProfitabilityData;
  cdiProfitability: ReturnProfitabilityData;
};

export class GetManyAssetPriceHistoryUseCase {
  constructor(
    private assetRepository: AssetBaseRepository,
    private CDIRepository: CDIBaseRepository, 
  ) {}

  async execute({ assets, endDate, startDate }: GetManyAssetPriceHistoryUseCaseRequest): Promise<GetManyAssetPriceHistoryUseCaseResponse> {
    const { removeNotBusinessDays, convertToISODate, filterArrayByDate } = dateUtils;
    const { calculateDailyProfitability, calculateCDIProfitability, calculatePortfolioReturns } = moneyUtils;

    const startDateFormatted = startDate ? convertToISODate(startDate) as Date : null;
    const endDateFormatted = endDate ? convertToISODate(endDate) as Date : null;

    const allAssets = await this.assetRepository.getManyBySymbol(assets.map((asset) => asset.ticker));    

    const portfolioData = allAssets.map((asset, index) => {
      if (!allAssets || typeof asset?.price_history !== "string") {
        throw new AssetNotFindError();
      }

      const tickerHistory: PriceHistory[] = JSON.parse(asset.price_history);

      const tickerHistoryFiltered = removeNotBusinessDays(
        tickerHistory
          .map((assetPrice) => ({
            date: new Date(assetPrice.date),
            close_price: assetPrice.close_price,
          })),
        "date"
      );

      const start = startDateFormatted ? startDateFormatted : tickerHistoryFiltered[0].date;
      const end = endDateFormatted ? endDateFormatted : tickerHistoryFiltered[tickerHistoryFiltered.length -1].date;

      const tickerHistoryFilteredByDate = filterArrayByDate({
        array: tickerHistoryFiltered,
        startDate: start,
        endDate: end,
        filterUndefinedField: "close_price",
      });
      
      const tickerProfitability = tickerHistoryFilteredByDate
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
        .filter((item) => item !== null);

      const weight = Number(assets[index].weight);
        
      return { weight, dailyReturns: tickerProfitability };
    });

    const CDIPriceHistory = await this.CDIRepository.getAll();

    const CDIHistoryFiltered = removeNotBusinessDays(
      CDIPriceHistory
        .map((assetPrice) => ({
          date: new Date(assetPrice.date),
          rate: assetPrice.rate,
        })),
      "date"
    );

    const start = startDateFormatted ? startDateFormatted : CDIHistoryFiltered[0].date;
    const end = endDateFormatted ? endDateFormatted : CDIHistoryFiltered[CDIHistoryFiltered.length -1].date;

    const CDIHistoryFilteredByDate = filterArrayByDate({
      array: CDIPriceHistory || [],
      startDate: start,
      endDate: end,
    });

    const cdiProfitability = CDIHistoryFilteredByDate.map((cdi) => ({
      date: cdi.date,
      profitabilityDay: calculateCDIProfitability(cdi.rate)
    }));

    const portfolioProfitability = calculatePortfolioReturns(portfolioData);

    return {
      portfolioProfitability,
      cdiProfitability
    };
  }
}

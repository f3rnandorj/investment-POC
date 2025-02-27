import { AssetNotFindError } from "@/errors";
import { AssetBaseRepository, CDIBaseRepository } from "@/repositories";
import { dateUtils, moneyUtils } from "@/utils";
import { PriceHistory } from "../AssetTypes";

interface GetAssetPriceHistoryUseCaseRequest {
  ticker: string;
  startDate?: string;
  endDate?: string;
}

export type ReturnProfitabilityData = {
  date: Date;
  profitabilityDay: number;
}[];

interface GetAssetPriceHistoryUseCaseResponse {
  tickerProfitability: ReturnProfitabilityData;
  cdiProfitability: ReturnProfitabilityData;
};

export class GetAssetPriceHistoryUseCase {
  constructor(
    private assetRepository: AssetBaseRepository, 
    private CDIRepository: CDIBaseRepository, 
  ) {}

  async execute({ ticker, endDate, startDate }: GetAssetPriceHistoryUseCaseRequest): Promise<GetAssetPriceHistoryUseCaseResponse> {
    const { removeNotBusinessDays, convertToISODate, filterArrayByDate } = dateUtils;
    const { calculateDailyProfitability, calculateCDIProfitability } = moneyUtils;
    
    const startDateFormatted = startDate ? convertToISODate(startDate) as Date : null;
    const endDateFormatted = endDate ? convertToISODate(endDate) as Date : null;

    const asset = await this.assetRepository.getBySymbol(ticker);

    const CDIPriceHistory = await this.CDIRepository.getAll();
  
    if (!asset || typeof asset?.price_history !== "string") {
      throw new AssetNotFindError();
    }
    
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

    const formattedData: GetAssetPriceHistoryUseCaseResponse = {
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
  
    return formattedData;
  }
}

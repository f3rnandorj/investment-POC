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
  accumulated_return: number;
}[];

interface GetAssetPriceHistoryUseCaseResponse {
  tickerReturns: ReturnProfitabilityData;
  cdiReturns: ReturnProfitabilityData;
};

export class GetAssetPriceHistoryUseCase {
  constructor(
    private assetRepository: AssetBaseRepository, 
    private CDIRepository: CDIBaseRepository, 
  ) {}

  async execute({ ticker, endDate, startDate }: GetAssetPriceHistoryUseCaseRequest): Promise<GetAssetPriceHistoryUseCaseResponse> {
    const { removeNotBusinessDays, convertToISODate } = dateUtils;
    
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

    const data = moneyUtils.calculateReturns(priceHistoryFiltered, CDIPriceHistory, start, end);
  
    return data;
  }
}

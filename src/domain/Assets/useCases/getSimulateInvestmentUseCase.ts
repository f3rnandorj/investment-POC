import { AssetBaseRepository } from "@/repositories";
import { dateUtils, moneyUtils } from "@/utils";
import { PriceHistory } from "../AssetTypes";
import { AssetNotFindError, } from "@/errors";

interface GetSimulateInvestmentUseCaseRequest {
  ticker: string;
  startDate: string;
  endDate: string;
  investment: string;
}

interface GetSimulateInvestmentUseCaseResponse {
  simulationReturn: number;
  initialInvestment: number;
  daysAmount: number;
}

export class GetSimulateInvestmentUseCase {
  constructor(
    private assetRepository: AssetBaseRepository
  ) {}

  async execute({
    endDate,
    startDate,
    investment,
    ticker, 
  }: GetSimulateInvestmentUseCaseRequest): Promise<GetSimulateInvestmentUseCaseResponse> {
    const { removeNotBusinessDays, convertToISODate, filterArrayByDate } = dateUtils;
    const { calculateSimulation, calculateDailyProfitability, calculateProfitabilityPeriod } = moneyUtils;

    const startDateFormatted = startDate ? convertToISODate(startDate) as Date : null;
    const endDateFormatted = endDate ? convertToISODate(endDate) as Date : null;
    
    const asset = await this.assetRepository.getBySymbol(ticker);

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

    const allProfitability = priceHistoryFilteredByDate
      .map((asset, index, array) => {
        const profitabilityDay = calculateDailyProfitability(
          { 
            price: asset.close_price,
            previousPrice: index > 0 ? array[index - 1].close_price : undefined, 
          }
        );

        return profitabilityDay !== null
          ? profitabilityDay 
          : null; 
      })
      .filter((item) => item !== null);

    const totalOfDays = priceHistoryFilteredByDate.length;

    const profitabilityPeriod = calculateProfitabilityPeriod(allProfitability);

    const simulationReturn = calculateSimulation({ totalOfDays, initialInvestment: Number(investment), profitabilityPeriod });

    return {
      initialInvestment: Number(investment),
      simulationReturn,
      daysAmount: totalOfDays
    };
  }
}

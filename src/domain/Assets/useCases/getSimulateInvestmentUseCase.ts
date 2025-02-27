import { AssetBaseRepository, CDIBaseRepository } from "@/repositories";
import { dateUtils, moneyUtils } from "@/utils";
import { PriceHistory } from "../AssetTypes";
import { prisma } from "@/lib/prisma";
import { EmptyPriceHistoryError, AssetNotFindError, InvalidPriceDataError, CDIRateNotFoundError } from "@/errors";

interface GetSimulateInvestmentUseCaseRequest {
  ticker: string;
  startDate: string;
  endDate: string;
  investment: string;
  frequency?: "daily" | "monthly" | "yearly"; 
}

interface GetSimulateInvestmentUseCaseResponse {
  simulationReturn: number;
  initialInvestment: number;
  frequency: "daily" | "monthly" | "yearly"; 
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
    frequency
  }: GetSimulateInvestmentUseCaseRequest): Promise<GetSimulateInvestmentUseCaseResponse> {
    const { removeNotBusinessDays, convertToISODate, filterArrayByDate } = dateUtils;
    const { calculateSimulation } = moneyUtils;

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

    const filteredByDatePriceHistory = filterArrayByDate({
      array: priceHistoryFiltered,
      startDate: start,
      endDate: end,
      filterUndefinedField: "close_price",
    });

    const data = moneyUtils.calculateProfitability({ priceHistoryFiltered: filteredByDatePriceHistory });

    const { tickerReturns } = data;

    const profitability = tickerReturns[tickerReturns.length -1].accumulated_return;

    const _frequency = frequency || "daily";
    const initialInvestment = Number(investment);

    const simulationReturn = calculateSimulation({
      startDate:start, endDate: end, investment: initialInvestment, profitability, frequency: _frequency
    });

    return {
      initialInvestment,
      simulationReturn,
      frequency: _frequency,
    };
  }
}

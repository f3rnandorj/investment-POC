import { AssetBaseRepository, CDIBaseRepository } from "@/repositories";
import { dateUtils } from "@/utils";
import { PriceHistory } from "../AssetTypes";
import { prisma } from "@/lib/prisma";
import { EmptyPriceHistoryError, AssetNotFindError, InvalidPriceDataError, CDIRateNotFoundError } from "@/errors";

interface GetSimulateInvestmentUseCaseRequest {
  ticker: string;
  startDate: string;
  endDate: string;
  investment: string;
}

interface GetSimulateInvestmentUseCaseResponse {
  investedAmount: number;
  finalValueAsset: number;
  finalValueCDI: number;
  assetReturn: number;
  cdiReturn: number;
};

export class GetSimulateInvestmentUseCase {
  constructor(
    private assetRepository: AssetBaseRepository, 
    private CDIRepository: CDIBaseRepository
  ) {}

  async execute(
    { endDate, investment, startDate, ticker } :GetSimulateInvestmentUseCaseRequest
  ): Promise<GetSimulateInvestmentUseCaseResponse> {
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

    const CDIPriceHistory = await this.CDIRepository.getAll();

    if (priceHistoryFiltered.length === 0) {
      throw new EmptyPriceHistoryError();
    }

    const initialPrice = priceHistoryFiltered[0].close_price;
    const finalPrice = priceHistoryFiltered[priceHistoryFiltered.length - 1].close_price;

    if (initialPrice === undefined || finalPrice === undefined) {
      throw new InvalidPriceDataError();
    }

    const assetReturn = (finalPrice - initialPrice) / initialPrice;
  
    const _startDate = dateUtils.convertToISODate(priceHistoryFiltered[0].date);
    const _endDate = dateUtils.convertToISODate(priceHistoryFiltered[priceHistoryFiltered.length - 1].date);

    const filteredCDI = CDIPriceHistory.filter((cdi) => {
      const cdiDate = cdi.date;
      return cdiDate >= _startDate && cdiDate <= _endDate;
    });

    if (filteredCDI.length === 0) {
      throw new CDIRateNotFoundError();
    }

    let cdiReturn = 1;
    for (const cdi of filteredCDI) {
      cdiReturn *= 1 + cdi.rate / 100; 
    }
    cdiReturn -= 1;

    const finalValueAsset = Number(investment) * (1 + assetReturn);
    const finalValueCDI = Number(investment) * (1 + cdiReturn);

    return {
      investedAmount: Number(investment),
      finalValueAsset,
      finalValueCDI,
      assetReturn: assetReturn * 100, 
      cdiReturn: cdiReturn * 100, 
    };
  }
}

import { PriceHistory, ReturnProfitabilityData } from "@/domain";
import {
  addBusinessDays,
  differenceInBusinessDays,
  format,
  parseISO,
} from "date-fns";

type CDIHistory = {
  id: number;
  date: Date;
  rate: number;
}[];

interface CalculateProfitability {
  priceHistoryFiltered: PriceHistory[];
  CDIPriceHistory?: CDIHistory;

}

function calculateProfitability(
  { priceHistoryFiltered, CDIPriceHistory }: CalculateProfitability
) {

  let accumulatedReturnTicker = 1;
  let accumulatedReturnCDI = 1;

  const tickerReturns: ReturnProfitabilityData = [];
  const cdiReturns: ReturnProfitabilityData = [];

  for (let i = 1; i < priceHistoryFiltered.length; i++) {
    const prev = priceHistoryFiltered[i - 1];
    const current = priceHistoryFiltered[i];
      
    if (prev.close_price && current.close_price) {
      const dailyReturn = (current.close_price - prev.close_price) / prev.close_price;
      accumulatedReturnTicker *= (1 + dailyReturn);
          
      tickerReturns.push({
        date: current.date,
        accumulated_return: accumulatedReturnTicker - 1,
      });
    }
  }

  if(CDIPriceHistory && CDIPriceHistory.length > 0) {
    for (let i = 0; i < CDIPriceHistory.length; i++) {
      const dailyReturn = CDIPriceHistory[i].rate / 100;
      accumulatedReturnCDI *= (1 + dailyReturn);
        
      cdiReturns.push({
        date: CDIPriceHistory[i].date,
        accumulated_return: accumulatedReturnCDI - 1,
      });
    }
  }

  return { tickerReturns, cdiReturns };
}

type SimulationParams = {
  investment: number;
  startDate: Date;
  endDate: Date;
  profitability: number; 
  frequency?: "daily" | "monthly" | "yearly"; 
};

function calculateSimulation({
  investment,
  startDate,
  endDate,
  profitability,
  frequency,
}: SimulationParams): number {
  const diffDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  if (!frequency) {
    return investment * (1 + profitability);
  }

  let periods: number;
  switch (frequency) {
  case "daily":
    periods = diffDays;
    break;
  case "monthly":
    periods = Math.floor(diffDays / 30);
    break;
  case "yearly":
    periods = Math.floor(diffDays / 365);
    break;
  default:
    throw new Error("Invalid frequency");
  }

  return investment * Math.pow(1 + profitability, periods);
}

export const moneyUtils = {
  calculateProfitability, 
  calculateSimulation
};
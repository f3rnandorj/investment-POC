import { PriceHistory, ReturnProfitabilityData } from "@/domain";

type CDIHistory = {
  id: number;
  date: Date;
  rate: number;
}[];

function calculateReturns(
  priceHistoryFiltered: PriceHistory[],
  CDIPriceHistory: CDIHistory,
  startDate: Date,
  endDate: Date
) {
  // Filtra os dados no intervalo desejado
  const filteredPriceHistory = priceHistoryFiltered
    .filter((entry) => entry.close_price !== undefined)
    .filter((entry) => entry.date >= startDate && entry.date <= endDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  console.log( filteredPriceHistory );

  const filteredCDIHistory = CDIPriceHistory
    .filter((entry) => entry.date >= startDate && entry.date <= endDate)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  let accumulatedReturnTicker = 1;
  let accumulatedReturnCDI = 1;

  const tickerReturns: ReturnProfitabilityData = [];
  const cdiReturns: ReturnProfitabilityData = [];

  for (let i = 1; i < filteredPriceHistory.length; i++) {
    const prev = filteredPriceHistory[i - 1];
    const current = filteredPriceHistory[i];
      
    if (prev.close_price && current.close_price) {
      const dailyReturn = (current.close_price - prev.close_price) / prev.close_price;
      accumulatedReturnTicker *= (1 + dailyReturn);
          
      tickerReturns.push({
        date: current.date,
        accumulated_return: accumulatedReturnTicker - 1,
      });
    }
  }

  for (let i = 0; i < filteredCDIHistory.length; i++) {
    const dailyReturn = filteredCDIHistory[i].rate / 100;
    accumulatedReturnCDI *= (1 + dailyReturn);
      
    cdiReturns.push({
      date: filteredCDIHistory[i].date,
      accumulated_return: accumulatedReturnCDI - 1,
    });
  }

  return { tickerReturns, cdiReturns };
}

export const moneyUtils = {
  calculateReturns
};
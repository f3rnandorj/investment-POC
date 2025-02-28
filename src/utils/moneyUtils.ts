interface CalculateDailyProfitabilityParams {
  price: number | undefined;
  previousPrice :number | undefined;
} 

function calculateDailyProfitability({ price, previousPrice }: CalculateDailyProfitabilityParams): number | null {
  if (price === undefined || previousPrice === undefined) {
    return null; 
  }

  return ((price / previousPrice) - 1) * 100; 
}

function calculateProfitabilityPeriod(allProfitability: number[]): number {
  if (allProfitability.length === 0) {
    return 0;
  }

  const totalProfitability = allProfitability.reduce((acc, dailyReturn) => acc * (1 + dailyReturn / 100), 1);
  
  return parseFloat(((totalProfitability - 1) * 100).toFixed(2));
}

function calculateCDIProfitability(price: number): number {
  return (price / 100) + 1 ; 
}

interface CalculateSimulationParams {
  initialInvestment: number;
  profitabilityPeriod: number; 
  totalOfDays: number;
}

function calculateSimulation({ totalOfDays, initialInvestment, profitabilityPeriod }:CalculateSimulationParams): number {
  const decimalRate = profitabilityPeriod / 100;
  
  const finalValue = initialInvestment * Math.pow(1 + decimalRate, totalOfDays);
  
  return parseFloat(finalValue.toFixed(2));
}

type DailyReturn = {
  date: Date; 
  profitabilityDay: number;
};

export type AssetWithWeight = {
  weight: number;
  dailyReturns: DailyReturn[];
};

function calculatePortfolioReturns(assets: AssetWithWeight[]): DailyReturn[] {
  const allDates = [...new Set(assets.flatMap((asset) => asset.dailyReturns.map((d) => d.date.getTime())))];

  allDates.sort((a, b) => a - b);

  const portfolioReturns: DailyReturn[] = allDates.map((timestamp) => {
    const date = new Date(timestamp);

    const profitabilityDay = assets.reduce((acc, asset) => {
      const assetReturn = asset.dailyReturns.find((d) => d.date.getTime() === timestamp);
      if (!assetReturn) return acc;

      return acc + assetReturn.profitabilityDay * (asset.weight / 100);
    }, 0);

    return { date, profitabilityDay };
  });

  return portfolioReturns;
}

export const moneyUtils = {
  calculateDailyProfitability, 
  calculateSimulation,
  calculateCDIProfitability,
  calculateProfitabilityPeriod,
  calculatePortfolioReturns
};
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

function calculateCDIProfitability(price: number): number {
  return (price / 100) + 1 ; 
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
  calculateDailyProfitability, 
  calculateSimulation,
  calculateCDIProfitability
};
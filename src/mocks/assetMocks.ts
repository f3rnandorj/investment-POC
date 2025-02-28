import { dateUtils } from "@/utils";
import { Prisma } from "@prisma/client";

const { convertToISODate, formatTimestamp } = dateUtils;

const assetsToCreate: Prisma.AssetCreateInput[] = [
  {
    symbol: "ALUG11",
    long_name: "Investo Msci US Real Estate ETF Fundo De Investimento De Indice Investimento Exterior",
    short_name: "INVESTO ALUGCI",
    exchange_name: "SAO",
    full_exchange_name: "São Paulo",
    instrument_type: "Equity",
    currency: "BRL",
    first_trade_date: 19801212,
    regular_market_time: 1700000000,
    regular_market_price: 175.25,
    fifty_two_week_high: 180.50,
    fifty_two_week_low: 135.20,
    regular_market_day_high: 176.30,
    regular_market_day_low: 174.10,
    regular_market_volume: 48200000,
    previous_close: 174.50,
    price_history: [
      {
        date: convertToISODate(formatTimestamp(1706151600)), // 25/01/2024
        open_price: 33.70000076293945,
        high_price: 34.18000030517578,
        low_price: 33.650001525878906,
        close_price: 34.04999923706055,
        volume: 2615
      },
      {
        date: convertToISODate(formatTimestamp(1706238000)), // 26/01/2024
        open_price: 34.18000030517578,
        high_price: 34.36000061035156,
        low_price: 33.7599983215332,
        close_price: 33.900001525878906,
        volume: 10055
      },
      {
        date: convertToISODate(formatTimestamp(1706497200)), // 29/01/2024
        open_price: 34.08000183105469,
        high_price: 34.369998931884766,
        low_price: 33.900001525878906,
        close_price: 34.369998931884766,
        volume: 2998
      },
    ]
  },
  {
    symbol: "TSLA",
    long_name: "Tesla Inc.",
    short_name: "Tesla",
    exchange_name: "NASDAQ",
    full_exchange_name: "NASDAQ Global Select Market",
    instrument_type: "Equity",
    currency: "USD",
    first_trade_date: 20100629,
    regular_market_time: 1700000000,
    regular_market_price: 815.30,
    fifty_two_week_high: 900.00,
    fifty_two_week_low: 580.00,
    regular_market_day_high: 820.00,
    regular_market_day_low: 810.00,
    regular_market_volume: 65230000,
    previous_close: 812.50,
    price_history: [
      {
        date: convertToISODate(formatTimestamp(1706140800)), // 25/01/2024
        open_price: 813.00,
        high_price: 818.00,
        low_price: 812.00,
        close_price: 815.30,
        volume: 1150000
      },
      {
        date: convertToISODate(formatTimestamp(1706227200)), // 26/01/2024
        open_price: 816.00,
        high_price: 821.50,
        low_price: 814.50,
        close_price: 818.75,
        volume: 1180000
      },
      {
        date: convertToISODate(formatTimestamp(1706313600)), // 27/01/2024
        open_price: 810.00,
        high_price: 820.00,
        low_price: 808.00,
        close_price: 812.50,
        volume: 1200000
      }
    ]
  },
  {
    symbol: "GOOGL",
    long_name: "Alphabet Inc.",
    short_name: "Google",
    exchange_name: "NASDAQ",
    full_exchange_name: "NASDAQ Global Select Market",
    instrument_type: "Equity",
    currency: "USD",
    first_trade_date: 20040819,
    regular_market_time: 1700000000,
    regular_market_price: 2750.00,
    fifty_two_week_high: 2850.00,
    fifty_two_week_low: 2300.00,
    regular_market_day_high: 2765.00,
    regular_market_day_low: 2735.00,
    regular_market_volume: 18450000,
    previous_close: 2740.00,
    price_history: [
      {
        date: convertToISODate(formatTimestamp(1706140800)), // 25/01/2024
        open_price: 2745.00,
        high_price: 2770.00,
        low_price: 2735.00,
        close_price: 2750.00,
        volume: 780000
      },
      {
        date: convertToISODate(formatTimestamp(1706227200)), // 26/01/2024
        open_price: 2755.00,
        high_price: 2780.00,
        low_price: 2745.00,
        close_price: 2770.00,
        volume: 790000
      },
      {
        date: convertToISODate(formatTimestamp(1706313600)), // 27/01/2024
        open_price: 2725.00,
        high_price: 2750.00,
        low_price: 2700.00,
        close_price: 2740.00,
        volume: 800000
      }          
    ]
  },
];

const FIRST_TICKER_OF_MOCKED_DATA = assetsToCreate[0].symbol;

export const assetMocks = {
  assetsToCreate,
  FIRST_TICKER_OF_MOCKED_DATA
};

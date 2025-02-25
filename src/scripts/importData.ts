 
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import xlsx from "xlsx";
import { PrismaClient } from "@prisma/client";
import { dateUtils } from "../utils/dateUtils";
// import { env } from "../env";

interface NativeAssetItem {
  codigoAtivo: string;
  nome: string;
  descricao: string;
  categoria: string;
  etiqueta: string;
  tipo: string;
  subtipo: string;
  nomeBovespa: string;
}

interface NativeCDI {
  data: string; 
  valor: string
}

interface ChartMeta {
  symbol?: string;
  longName?: string;
  shortName?: string;
  exchangeName?: string;
  fullExchangeName?: string;
  instrumentType?: string;
  currency?: string;
  firstTradeDate?: number;
  regularMarketTime?: number;
  regularMarketPrice?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  previousClose?: number;
}

interface QuoteIndicators {
  open?: number[];
  high?: number[];
  low?: number[];
  close?: number[];
  volume?: number[];
}

interface ChartResult {
  meta?: ChartMeta;
  timestamp?: number[];
  indicators?: {
    quote?: QuoteIndicators[];
  };
}

interface ChartData {
  chart?: {
    result?: ChartResult[];
  };
}

interface PriceHistory {
  timestamp: number;
  open_price?: number;
  high_price?: number;
  low_price?: number;
  close_price?: number;
  volume?: number;
}

enum ModelNames {
  ASSET_INFO = "asset_info",
  CDI = "cdi",
  ASSET = "asset",
}

const DATA_FOLDER = "./data";

export const prisma = new PrismaClient();

async function parseCSV(filePath: string): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    const results: Record<string, unknown>[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

async function parseXLSX(filePath: string): Promise<Record<string, unknown>[]> {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
}

async function insertData( modelName: ModelNames, data: any) {
  console.log({ modelName, data });

  switch (modelName) {
  case ModelNames.ASSET_INFO:
    await prisma.assetInfo.create({ data });
    break;
  case ModelNames.CDI:
    await prisma.cdi.create({
      data: {
        date: dateUtils.convertToISODate(data.date),
        rate: data.rate
      } 
    });
    break;
  case ModelNames.ASSET:
    { const asset = await prisma.asset.create({
      data: {
        symbol: data.symbol,
        long_name: data.long_name,
        short_name: data.short_name,
        exchange_name: data.exchange_name,
        full_exchange_name: data.full_exchange_name,
        instrument_type: data.instrument_type,
        currency: data.currency,
        first_trade_date: data.first_trade_date,
        regular_market_time: data.regular_market_time,
        regular_market_price: data.regular_market_price,
        fifty_two_week_high: data.fifty_two_week_high,
        fifty_two_week_low: data.fifty_two_week_low,
        regular_market_day_high: data.regular_market_day_high,
        regular_market_day_low: data.regular_market_day_low,
        regular_market_volume: data.regular_market_volume,
        previous_close: data.previous_close,
      },
    });

    if (data.price_history?.create?.length) {
      await prisma.priceHistory.createMany({
        data: data.price_history.create.map((history: any) => ({
          asset_id: asset.id, // Agora temos o ID do Asset para vincular
          timestamp: history.timestamp,
          open_price: history.open_price ?? 0,
          high_price: history.high_price ?? 0,
          low_price: history.low_price ?? 0,
          close_price: history.close_price ?? 0,
          volume: history.volume ?? 0,
        })),
      });
    }
    }
    break;
  default:
    throw new Error(`Model "${modelName}" not recognized.`);
  }
}

async function importData() {
  const files = fs.readdirSync(DATA_FOLDER);

  for (const file of files) {
    const filePath = path.join(DATA_FOLDER, file);
    let jsonData: any[] = [];
    
    if (file.endsWith(".json")) {
      jsonData = [JSON.parse(fs.readFileSync(filePath, "utf-8"))];
    } 
    // else if (file.endsWith(".csv")) {
    //   jsonData = await parseCSV(filePath);
    // } else if (file.endsWith(".xlsx")) {
    //   jsonData = await parseXLSX(filePath);
    // }

    if (jsonData.length > 0 ) {
      console.log("aqui");
      let modelName: ModelNames;

      if (file.startsWith("ativos")) {
        modelName = ModelNames.ASSET_INFO;
        jsonData = jsonData.map((item: NativeAssetItem) => ({          
          asset_code: item.codigoAtivo,
          name: item.nome,
          description: item.descricao,
          category: item.categoria,
          tag: item.etiqueta,
          type: item.tipo,
          subtype: item.subtipo,
          bovespa_name: item.nomeBovespa,
        }));
      } else if (file.startsWith("CDI")) {
        modelName = ModelNames.CDI;
        jsonData = jsonData.map((item: NativeCDI) => ({
          date: new Date(item.data),
          rate: parseFloat(item.valor),
        }));
      } else {
        modelName = ModelNames.ASSET;
        jsonData = jsonData.map((item: ChartData) => ({
          symbol: item.chart?.result?.[0]?.meta?.symbol,
          long_name: item.chart?.result?.[0]?.meta?.longName,
          short_name: item.chart?.result?.[0]?.meta?.shortName,
          exchange_name: item.chart?.result?.[0]?.meta?.exchangeName,
          full_exchange_name: item.chart?.result?.[0]?.meta?.fullExchangeName,
          instrument_type: item.chart?.result?.[0]?.meta?.instrumentType,
          currency: item.chart?.result?.[0]?.meta?.currency,
          first_trade_date: item.chart?.result?.[0]?.meta?.firstTradeDate,
          regular_market_time: item.chart?.result?.[0]?.meta?.regularMarketTime,
          regular_market_price: item.chart?.result?.[0]?.meta?.regularMarketPrice,
          fifty_two_week_high: item.chart?.result?.[0]?.meta?.fiftyTwoWeekHigh,
          fifty_two_week_low: item.chart?.result?.[0]?.meta?.fiftyTwoWeekLow,
          regular_market_day_high: item.chart?.result?.[0]?.meta?.regularMarketDayHigh,
          regular_market_day_low: item.chart?.result?.[0]?.meta?.regularMarketDayLow,
          regular_market_volume: item.chart?.result?.[0]?.meta?.regularMarketVolume,
          previous_close: item.chart?.result?.[0]?.meta?.previousClose,
          
          price_history: {
            create: item.chart?.result?.[0]?.timestamp?.map((ts: number, index: number) => ({
              timestamp: ts,
              open_price: item.chart?.result?.[0]?.indicators?.quote?.[0]?.open?.[index] ?? 0,
              high_price: item.chart?.result?.[0]?.indicators?.quote?.[0]?.high?.[index] ?? 0,
              low_price: item.chart?.result?.[0]?.indicators?.quote?.[0]?.low?.[index] ?? 0,
              close_price: item.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.[index] ?? 0,
              volume: item.chart?.result?.[0]?.indicators?.quote?.[0]?.volume?.[index] ?? 0,
            })) || [],
          },
        }));
      }

      for (const data of jsonData) {
        try {
          await insertData(modelName, data);
          
          console.log(`Inserted ${jsonData.length} records into ${modelName}`);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
  // await prisma.asset.deleteMany({});
  // await prisma.priceHistory.deleteMany({});
  // await prisma.assetInfo.deleteMany({});
  // await prisma.cdi.deleteMany({});

  await prisma.$disconnect();
}

importData().catch((e) => console.error("ERROR => ", e));

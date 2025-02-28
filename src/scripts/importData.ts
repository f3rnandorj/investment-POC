 
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import xlsx from "xlsx";
import { Prisma, PrismaClient } from "@prisma/client";
import { dateUtils } from "../utils/dateUtils";
import { stringUtils } from "../utils/stringUtils";

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
  symbol: string;
  longName: string;
  shortName: string;
  exchangeName: string;
  fullExchangeName: string;
  instrumentType: string;
  currency: string;
  firstTradeDate: number;
  regularMarketTime: number;
  regularMarketPrice: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  previousClose: number;
}

interface QuoteIndicators {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
}

interface ChartResult {
  meta: ChartMeta;
  timestamp: number[];
  indicators: {
    quote: QuoteIndicators[];
  };
}

interface ChartData {
  chart: {
    result: ChartResult[];
  };
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

async function insertData(modelName: ModelNames, dataArray: any[]) {
  const batchSize = 500; 

  switch (modelName) {
  case ModelNames.ASSET_INFO:
    await prisma.assetInfo.createMany({
      data: dataArray,
    });
    break;

  case ModelNames.CDI:
    for (let i = 0; i < dataArray.length; i += batchSize) {
      await prisma.cdi.createMany({
        data: dataArray.slice(i, i + batchSize).map((data) => ({
          date: dateUtils.convertToISODate(data.date) as Date,
          rate: data.rate,
        })),
      });
    }
    break;

  case ModelNames.ASSET:{
    for (const data of dataArray) {
      const assetItem = data as Prisma.AssetCreateInput;
  
      await prisma.asset.create({
        data: {
          symbol: stringUtils.getStringBeforeDot(assetItem.symbol),
          long_name: assetItem.long_name,
          short_name: assetItem.short_name,
          exchange_name: assetItem.exchange_name,
          full_exchange_name: assetItem.full_exchange_name,
          instrument_type: assetItem.instrument_type,
          currency: assetItem.currency,
          first_trade_date: assetItem.first_trade_date,
          regular_market_time: assetItem.regular_market_time,
          regular_market_price: assetItem.regular_market_price,
          fifty_two_week_high: assetItem.fifty_two_week_high,
          fifty_two_week_low: assetItem.fifty_two_week_low,
          regular_market_day_high: assetItem.regular_market_day_high,
          regular_market_day_low: assetItem.regular_market_day_low,
          regular_market_volume: assetItem.regular_market_volume,
          previous_close: assetItem.previous_close,

          price_history: assetItem.price_history
        },
      });
    }
  }
  
    break;

  default:
    throw new Error(`Model "${modelName}" not recognized.`);
  }
}

async function importData() {
  const { convertToISODate, formatTimestamp } = dateUtils; 
  const files = fs.readdirSync(DATA_FOLDER);

  for (const file of files) {
    const filePath = path.join(DATA_FOLDER, file);
    let jsonData: any[] = [];
    let modelName: ModelNames | null = null; 

    if (file.endsWith(".json")) {
      jsonData = [JSON.parse(fs.readFileSync(filePath, "utf-8"))];
    } else if (file.endsWith(".csv")) {
      jsonData = await parseCSV(filePath);
    } else if (file.endsWith(".xlsx")) {
      jsonData = await parseXLSX(filePath);
    }

    if (jsonData.length > 0) {
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
          date: item.data,
          rate: Number(item.valor),
        }));
      } else {
        modelName = ModelNames.ASSET;
        jsonData = jsonData.map((item: ChartData): Prisma.AssetCreateInput => ({
          symbol: item.chart.result[0].meta.symbol,
          long_name: item.chart.result[0].meta.longName,
          short_name: item.chart.result[0].meta.shortName,
          exchange_name: item.chart.result[0].meta.exchangeName,
          full_exchange_name: item.chart.result[0].meta.fullExchangeName,
          instrument_type: item.chart.result[0].meta.instrumentType,
          currency: item.chart.result[0].meta.currency,
          first_trade_date: item.chart.result[0].meta.firstTradeDate,
          regular_market_time: item.chart.result[0].meta.regularMarketTime,
          regular_market_price: item.chart.result[0].meta.regularMarketPrice,
          fifty_two_week_high: item.chart.result[0].meta.fiftyTwoWeekHigh,
          fifty_two_week_low: item.chart.result[0].meta.fiftyTwoWeekLow,
          regular_market_day_high: item.chart.result[0].meta.regularMarketDayHigh,
          regular_market_day_low: item.chart.result[0].meta.regularMarketDayLow,
          regular_market_volume: item.chart.result[0].meta.regularMarketVolume,
          previous_close: item.chart.result[0].meta.previousClose,

          price_history: JSON.stringify(
            item.chart.result[0].timestamp?.map((ts: number, index: number) => ({
              date: convertToISODate(formatTimestamp(ts)),
              open_price: item.chart.result[0].indicators.quote[0].open?.[index] ?? null,
              high_price: item.chart.result[0].indicators.quote[0].high?.[index] ?? null,
              low_price: item.chart.result[0].indicators.quote[0].low?.[index] ?? null,
              close_price: item.chart.result[0].indicators.quote[0].close?.[index] ?? null,
              volume: item.chart.result[0].indicators.quote[0].volume?.[index] ?? null
            })) ?? []
          )
        }));

      }
    }

    if (modelName) {
      try {
        console.log("Aguarde enquanto estamos inserindo as dados no banco...");
        
        await insertData(modelName, jsonData);

        console.log(`Inserted ${jsonData.length} records into ${modelName}`);
      } catch (error) {
        console.error(`Error inserting data into ${modelName}:`, error);
      }
    }
  }
  
  console.log("✅ Processo concluído com sucesso!");
  await prisma.$disconnect();
}

importData().catch((e) => console.error("ERROR => ", e));

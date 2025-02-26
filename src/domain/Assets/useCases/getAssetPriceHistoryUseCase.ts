import { prisma } from "@/lib/prisma";
import { AssetBaseRepository, CDIBaseRepository } from "@/repositories";
import { dateUtils } from "@/utils";

interface PriceHistory {
  timestamp: number;
  open_price?: number;
  high_price?: number;
  low_price?: number;
  close_price?: number;
  volume?: number;
}

export class GetAssetPriceHistoryUseCase {
  constructor(
    private assetRepository: AssetBaseRepository, 
    private CDIRepository: CDIBaseRepository
  ) {}
  
  async execute(ticker: string) {
    const asset = await this.assetRepository.getBySymbol(ticker);

    if (!asset || typeof asset?.priceHistory !== "string") {
      // return reply.status(404).send({ message: "Ativo não encontrado" });
      return;
    }
    
    const cdiHistory = await this.CDIRepository.getAll();
    
    const priceHistory: PriceHistory[] = JSON.parse(asset.priceHistory);

    const data = {
      ticker: asset.symbol,
      name: asset.long_name,
      priceHistory: priceHistory.map((assetPrice) => ({
        date: dateUtils.formatTimestamp(assetPrice.timestamp),
        close_price: assetPrice.close_price,
      })),
      cdiHistory: cdiHistory.map((cdiPrice) => ({
        date: dateUtils.convertToISODate(cdiPrice.date),
        close_price: cdiPrice.rate,
      })),
    };

    return data;
  }
}
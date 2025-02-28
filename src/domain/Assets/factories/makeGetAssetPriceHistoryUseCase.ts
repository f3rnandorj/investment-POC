import { PrismaAssetRepository, PrismaCDIRepository } from "@/repositories";
import { GetAssetPriceHistoryUseCase } from "../useCases/getAssetPriceHistoryUseCase";

export function makeGetAssetPriceHistoryUseCase() {
  const prismaCDIRepository = new PrismaCDIRepository();
  const prismaAssetRepository = new PrismaAssetRepository();
  const getAssetPriceHistoryUseCase = new GetAssetPriceHistoryUseCase(prismaAssetRepository, prismaCDIRepository);

  return getAssetPriceHistoryUseCase;
}
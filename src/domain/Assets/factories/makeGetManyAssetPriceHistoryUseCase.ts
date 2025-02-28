import { PrismaAssetRepository, PrismaCDIRepository } from "@/repositories";
import { GetManyAssetPriceHistoryUseCase } from "../useCases/getManyAssetPriceHistoryUseCase";

export function makeGetManyAssetPriceHistoryUseCase() {
  const prismaCDIRepository = new PrismaCDIRepository();
  const prismaAssetRepository = new PrismaAssetRepository();
  const getAssetPriceHistoryUseCase = new GetManyAssetPriceHistoryUseCase(prismaAssetRepository, prismaCDIRepository);

  return getAssetPriceHistoryUseCase;
}
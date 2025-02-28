import { PrismaAssetInfoRepository } from "@/repositories";
import { GetAllAssetInfosUseCase } from "../useCases/getAllAssetInfosUseCase";

export function makeGetAllAssetInfosUseCase() {
  const prismaAssetInfoRepository = new PrismaAssetInfoRepository();
  const getAllAssetInfosUseCase = new GetAllAssetInfosUseCase(prismaAssetInfoRepository);

  return getAllAssetInfosUseCase;
}
import { PrismaAssetRepository } from "@/repositories";
import { GetSimulateInvestmentUseCase } from "../useCases/getSimulateInvestmentUseCase";

export function makeGetSimulateInvestmentUseCase() {
  const prismaAssetRepository = new PrismaAssetRepository();
  const simulateInvestmentUseCase = new GetSimulateInvestmentUseCase(prismaAssetRepository);

  return simulateInvestmentUseCase;
}
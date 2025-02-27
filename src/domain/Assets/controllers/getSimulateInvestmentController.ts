import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaAssetRepository, PrismaCDIRepository } from "@/repositories";
import { GetSimulateInvestmentUseCase } from "../useCases/getSimulateInvestmentUseCase";

// EndpointEX http://localhost:3333/simulate-investment?ticker=ALUG11&startDate=2024-01-01&endDate=2024-02-01&investment=1000

export async function getSimulateInvestmentController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    ticker: z.string().min(1, "Ticker não pode ser vazio"),
    startDate: z.string(),
    endDate: z.string(),
    investment: z.string(),
  });

  try {
    const { ticker, endDate, investment, startDate } = paramsSchema.parse(request.query);

    const prismaAssetRepository = new PrismaAssetRepository();
    const prismaCDIRepository = new PrismaCDIRepository();
    const simulateInvestmentUseCase = new GetSimulateInvestmentUseCase(prismaAssetRepository, prismaCDIRepository);

    const result = await simulateInvestmentUseCase.execute({ ticker, endDate, investment, startDate });

    return reply.status(200).send(result);
  } catch (err) {
    throw err;
  }
}

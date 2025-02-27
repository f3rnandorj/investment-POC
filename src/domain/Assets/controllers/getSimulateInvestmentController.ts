import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaAssetRepository } from "@/repositories";
import { GetSimulateInvestmentUseCase } from "../useCases/getSimulateInvestmentUseCase";

// EndpointEX http://localhost:3333/simulate-investment?ticker=ALUG11&startDate=01/01/2024&endDate=01/02/2024&investment=1000

// or

// EndpointEX http://localhost:3333/simulate-investment?ticker=ALUG11&startDate=01/01/2024&endDate=01/02/2024&investment=1000&frequency=monthly

export async function getSimulateInvestmentController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    ticker: z.string().min(1, "Ticker não pode ser vazio").min(1, "Deve haver pelo menos um ticker"),
    startDate: z.string(),
    endDate: z.string(),
    investment: z.string(),
    frequency: z.enum(["daily", "monthly", "yearly"]).optional(),
  });

  try {
    const { ticker, startDate, endDate, investment, frequency } = paramsSchema.parse(request.query);

    const prismaAssetRepository = new PrismaAssetRepository();
    const simulateInvestmentUseCase = new GetSimulateInvestmentUseCase(prismaAssetRepository);

    const result = await simulateInvestmentUseCase.execute({ ticker, startDate, endDate, investment, frequency });

    return reply.status(200).send(result);
  } catch (err) {
    throw err;
  }
}

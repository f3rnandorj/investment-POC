import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaAssetRepository } from "@/repositories";
import { GetSimulateInvestmentUseCase } from "../useCases/getSimulateInvestmentUseCase";
import { AssetNotFindError } from "@/errors";

export async function getSimulateInvestmentController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    ticker: z.string().min(1, "Ticker não pode ser vazio").min(1, "Deve haver pelo menos um ticker"),
    startDate: z.string(),
    endDate: z.string(),
    investment: z.string(),
  });

  try {
    const { ticker, startDate, endDate, investment } = paramsSchema.parse(request.query);

    const prismaAssetRepository = new PrismaAssetRepository();
    const simulateInvestmentUseCase = new GetSimulateInvestmentUseCase(prismaAssetRepository);

    const result = await simulateInvestmentUseCase.execute({ ticker, startDate, endDate, investment });

    return reply.status(200).send(result);
  } catch (err) {
    if (err instanceof AssetNotFindError) {
      reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}

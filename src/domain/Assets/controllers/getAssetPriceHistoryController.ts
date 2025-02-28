import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GetAssetPriceHistoryUseCase } from "../useCases/getAssetPriceHistoryUseCase";
import { PrismaAssetRepository, PrismaCDIRepository } from "@/repositories";
import { AssetNotFindError } from "@/errors";

export async function getAssetPriceHistoryController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    ticker: z.string().min(1, "Ticker não pode ser vazio"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  });

  try {
    const { ticker, startDate, endDate } = paramsSchema.parse(request.query);

    const prismaCDIRepository = new PrismaCDIRepository();
    const prismaAssetRepository = new PrismaAssetRepository();
    const getAssetPriceHistoryUseCase = new GetAssetPriceHistoryUseCase(prismaAssetRepository, prismaCDIRepository);

    const data = await getAssetPriceHistoryUseCase.execute({ ticker, startDate, endDate });

    return reply.status(200).send(data);
  } catch (err) {
    if(err instanceof AssetNotFindError) {
      reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}

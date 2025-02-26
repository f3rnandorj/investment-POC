import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GetAssetPriceHistoryUseCase } from "../useCases/getAssetPriceHistoryUseCase";
import { PrismaAssetRepository } from "@/repositories";
import { AssetNotFindError } from "@/errors";

//EndpointEX http://localhost:3333/price-history?ticker=ALUG11&startDate=2023-01-01&endDate=2023-03-20

export async function getAssetPriceHistoryController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    ticker: z.string().min(1, "Ticker não pode ser vazio"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  });

  try {
    const { ticker, startDate, endDate } = paramsSchema.parse(request.query);

    const prismaAssetRepository = new PrismaAssetRepository();
    const getAssetPriceHistoryUseCase = new GetAssetPriceHistoryUseCase(prismaAssetRepository);

    const data = await getAssetPriceHistoryUseCase.execute({ ticker, startDate, endDate });

    return reply.status(200).send(data);
  } catch (err) {
    if(err instanceof AssetNotFindError) {
      reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}

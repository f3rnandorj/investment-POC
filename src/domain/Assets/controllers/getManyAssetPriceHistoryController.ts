import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaAssetRepository } from "@/repositories";
import { AssetNotFindError } from "@/errors";
import { GetManyAssetPriceHistoryUseCase } from "../useCases/getManyAssetPriceHistoryUseCase";

export async function getManyAssetPriceHistoryController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    tickers: z.array(z.string().min(1, "Ticker não pode ser vazio")).min(1, "Deve haver pelo menos um ticker"),
  });

  try {
    const { tickers } = paramsSchema.parse(request.query);

    const prismaAssetRepository = new PrismaAssetRepository();
    const getAssetPriceHistoryUseCase = new GetManyAssetPriceHistoryUseCase(prismaAssetRepository);

    const data = await getAssetPriceHistoryUseCase.execute(tickers);

    return reply.status(200).send(data);
  } catch (err) {
    if(err instanceof AssetNotFindError) {
      reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}

import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaAssetRepository } from "@/repositories";
import { AssetNotFindError } from "@/errors";
import { GetManyAssetPriceHistoryUseCase } from "../useCases/getManyAssetPriceHistoryUseCase";

// EndpointEX http://localhost:3333/wallet-price-history?tickers=ALUG11&tickers=WRLD11&startDate=2023-01-01&endDate=2023-05-20

export async function getManyAssetPriceHistoryController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    tickers: z.array(z.string().min(1, "Ticker não pode ser vazio")).min(1, "Deve haver pelo menos um ticker"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  });

  try {
    const { tickers, startDate, endDate } = paramsSchema.parse(request.query);

    const prismaAssetRepository = new PrismaAssetRepository();
    const getAssetPriceHistoryUseCase = new GetManyAssetPriceHistoryUseCase(prismaAssetRepository);

    const data = await getAssetPriceHistoryUseCase.execute({ tickers, startDate, endDate });

    return reply.status(200).send(data);
  } catch (err) {
    if (err instanceof AssetNotFindError) {
      reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}

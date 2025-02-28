import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AssetNotFindError } from "@/errors";
import { makeGetAssetPriceHistoryUseCase } from "../factories/makeGetAssetPriceHistoryUseCase";

export async function getAssetPriceHistoryController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    ticker: z.string().min(1, "Ticker não pode ser vazio"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  });

  try {
    const { ticker, startDate, endDate } = paramsSchema.parse(request.query);

    const getAssetPriceHistoryUseCase = makeGetAssetPriceHistoryUseCase();

    const data = await getAssetPriceHistoryUseCase.execute({ ticker, startDate, endDate });

    return reply.status(200).send(data);
  } catch (err) {
    if(err instanceof AssetNotFindError) {
      reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}

import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GetAssetPriceHistoryUseCase } from "../useCases/getAssetPriceHistoryUseCase";
import { PrismaAssetRepository, PrismaCDIRepository } from "@/repositories";

export async function getAssetPriceHistoryController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    ticker: z.string().min(1, "Ticker não pode ser vazio"),
  });

  try {
    const { ticker } = paramsSchema.parse(request.query);

    const prismaAssetRepository = new PrismaAssetRepository();
    const prismaCDIRepository = new PrismaCDIRepository();
    const getAssetPriceHistoryUseCase = new GetAssetPriceHistoryUseCase(prismaAssetRepository, prismaCDIRepository);

    const data = await getAssetPriceHistoryUseCase.execute(ticker);

    return reply.status(200).send(data);
  } catch (err) {
    return reply.status(409).send({ message: "Cannot find asset" });
  }
}

import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PrismaAssetRepository, PrismaCDIRepository } from "@/repositories";
import { AssetNotFindError } from "@/errors";
import { GetManyAssetPriceHistoryUseCase } from "../useCases/getManyAssetPriceHistoryUseCase";

const PERCENT = 100;

export async function getManyAssetPriceHistoryController(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    assets: z.array(
      z.object({
        ticker: z.string().min(1, "Ticker não pode ser vazio"),
        weight: z.string().min(1, "Peso deve ser maior ou igual a 0"),
      })
    ).min(2, "Deve haver pelo dois um ticker"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  });

  try {
    const { assets, startDate, endDate } = paramsSchema.parse(request.body);

    const weights = assets.reduce((acc, item) => acc + Number(item.weight), 0);

    if (weights !== PERCENT) {
      reply.status(400).send({ message: `A soma dos pesos (${weights}%) não é igual a ${PERCENT}%.` });
    }

    const prismaCDIRepository = new PrismaCDIRepository();
    const prismaAssetRepository = new PrismaAssetRepository();
    const getAssetPriceHistoryUseCase = new GetManyAssetPriceHistoryUseCase(prismaAssetRepository, prismaCDIRepository);

    const data = await getAssetPriceHistoryUseCase.execute({ assets, startDate, endDate });

    return reply.status(200).send(data);
  } catch (err) {
    if (err instanceof AssetNotFindError) {
      reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}

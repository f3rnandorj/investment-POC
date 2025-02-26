
import { GetAllAssetInfosUseCase } from "@/domain";
import { PrismaAssetInfoRepository } from "@/repositories";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getAllAssetInfosController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const prismaAssetInfoRepository = new PrismaAssetInfoRepository();
    const getAllAssetInfosUseCase = new GetAllAssetInfosUseCase(prismaAssetInfoRepository);

    const data = await getAllAssetInfosUseCase.execute();

    return reply.status(200).send(data);
  } catch (err) {
    throw err;
  }
}
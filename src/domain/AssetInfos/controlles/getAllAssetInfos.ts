
import { PrismaAssetInfosRepository } from "@/repositories";
import { FastifyReply, FastifyRequest } from "fastify";
import { GetAllAssetInfosUseCase } from "../useCases/getAllAssetInfosUseCase";

export async function getAllAssetInfos(request: FastifyRequest, reply: FastifyReply) {
  try {
    const prismaAssetInfosRepository = new PrismaAssetInfosRepository();
    const getAllAssetInfosUseCase = new GetAllAssetInfosUseCase(prismaAssetInfosRepository);

    const data = await getAllAssetInfosUseCase.execute();

    return reply.status(200).send(data);
  } catch (err) {
    return reply.status(409).send();
  }
}
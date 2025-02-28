
import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetAllAssetInfosUseCase } from "../factories/makeGetAllAssetInfosUseCase";

export async function getAllAssetInfosController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getAllAssetInfosUseCase = makeGetAllAssetInfosUseCase();

    const data = await getAllAssetInfosUseCase.execute();

    return reply.status(200).send(data);
  } catch (err) {
    throw err;
  }
}
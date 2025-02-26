
import { getAllAssetInfos } from "@/domain";
import { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.get("/assets", getAllAssetInfos);
}

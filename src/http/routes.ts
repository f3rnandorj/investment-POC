
import { getAllAssetInfosController, getAssetPriceHistoryController } from "@/domain";
import { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.get("/assets", getAllAssetInfosController);

  app.get("/price-history", getAssetPriceHistoryController);
}

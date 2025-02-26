
import { getAllAssetInfosController, getAssetPriceHistoryController, getManyAssetPriceHistoryController } from "@/domain";
import { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.get("/assets", getAllAssetInfosController);

  app.get("/price-history", getAssetPriceHistoryController);

  app.get("/wallet-price-history", getManyAssetPriceHistoryController);
}

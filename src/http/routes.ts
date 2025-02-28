
import { getAllAssetInfosController, getAssetPriceHistoryController, getManyAssetPriceHistoryController, getSimulateInvestmentController } from "@/domain";
import { FastifyInstance } from "fastify";

export async function appRoutes(app: FastifyInstance) {
  app.get("/assets", getAllAssetInfosController);

  app.get("/price-history", getAssetPriceHistoryController);

  app.post("/wallet-price-history", getManyAssetPriceHistoryController);

  app.get("/simulate-investment", getSimulateInvestmentController);
}

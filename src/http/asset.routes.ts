import { getAssetPriceHistoryController, getManyAssetPriceHistoryController, getSimulateInvestmentController } from "@/domain";
import { FastifyInstance } from "fastify";
import { assetSwaggerSchemas } from "./swaggerSchemas/Assets";

export async function assetRoutes(app: FastifyInstance) {
  app.get("/price-history", {
    schema: assetSwaggerSchemas.priceHistory
  }, getAssetPriceHistoryController);

  app.post("/wallet-price-history", {
    schema: assetSwaggerSchemas.walletPriceHistory
  }, getManyAssetPriceHistoryController);

  app.get("/simulate-investment", {
    schema: assetSwaggerSchemas.simulateInvestment
  }, getSimulateInvestmentController);
}
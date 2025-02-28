import { getAllAssetInfosController } from "@/domain";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { assetInfoSwaggerSchemas } from "./swaggerSchemas/AssetInfos";

export async function assetInfoRoutes(app: FastifyInstance) {
  app.get(
    "/assets-infos",
    {
      schema: assetInfoSwaggerSchemas.assetInfos,
    },
    getAllAssetInfosController
  );
}

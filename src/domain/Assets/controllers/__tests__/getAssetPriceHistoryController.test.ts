import request from "supertest";
import { execSync } from "node:child_process";
import { app } from "@/app";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("GetAssetPriceHistory Controller (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
    
    console.log("⏳ Importando dados antes de rodar os testes...");
    try {
      execSync("npx ts-node scripts/importData.ts", { stdio: "inherit" });
    } catch (error) {
      console.error("❌ Erro ao importar dados:", error);
      process.exit(1); 
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able get the asset price history", async () => {
    const response = await request(app.server).get("/price-history").query({
      ticker: "ALUG11",
      startDate: "26/01/2024",
      endDate: "29/01/2024",
    });

    expect(response.status).toEqual(200);
  });

  it("should return Asset Not Find Error when passing an existent asset", async () => {
    const response = await request(app.server).get("/price-history").query({
      ticker: "MSFT",
      startDate: "26/01/2024",
      endDate: "29/01/2024",
    });

    expect(response.status).toEqual(404);
  });
});
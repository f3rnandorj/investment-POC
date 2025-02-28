
import request from "supertest";
import { execSync } from "node:child_process";
import { app } from "@/app";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("GetAllAssetInfos Controller (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
    
    console.log("⏳ Importando dados antes de rodar os testes...");
    try {
      execSync("npx ts-node src/scripts/importData.ts", { stdio: "inherit" });
    } catch (error) {
      console.error("❌ Erro ao importar dados:", error);
      process.exit(1); 
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able get all the asset infos", async () => {
    const response = await request(app.server).get("/assets-infos");

    expect(response.status).toEqual(200);
  });
});
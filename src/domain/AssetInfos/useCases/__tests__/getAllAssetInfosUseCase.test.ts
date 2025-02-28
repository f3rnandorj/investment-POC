import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryAssetInfoRepository } from "@/repositories/inMemory";
import { GetAllAssetInfosUseCase } from "../getAllAssetInfosUseCase";
import { assetInfoMocks } from "@/mocks/assetInfoMocks";

let inMemoryAssetInfoRepository: InMemoryAssetInfoRepository;
let sut: GetAllAssetInfosUseCase;

describe("GetAllAssetInfos Use Case", () => {
  beforeEach(() => {
    inMemoryAssetInfoRepository = new InMemoryAssetInfoRepository();
    sut = new GetAllAssetInfosUseCase(inMemoryAssetInfoRepository);

    assetInfoMocks.assetInfosToCreate.map((assetInfo) => inMemoryAssetInfoRepository.create(assetInfo)); 
  });
  
  it("should return all asset infos", async () => {
    const assetInfos = await sut.execute();

    expect(assetInfos.length).toEqual(assetInfoMocks.assetInfosToCreate.length);
  });

});

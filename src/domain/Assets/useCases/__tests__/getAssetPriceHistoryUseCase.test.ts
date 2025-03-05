import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { GetAssetPriceHistoryUseCase } from "../getAssetPriceHistoryUseCase";
import { InMemoryAssetRepository, InMemoryCDIRepository } from "@/repositories/inMemory";
import { assetMocks, CDIMocks } from "@/mocks";
import { AssetNotFindError, DateIntervalTooShortError } from "@/errors";

let inMemoryCDIRepository: InMemoryCDIRepository;
let inMemoryAssetRepository: InMemoryAssetRepository;
let sut: GetAssetPriceHistoryUseCase;

describe("GetAssetPriceHistory Use Case", () => {
  beforeEach(() => {
    inMemoryCDIRepository = new InMemoryCDIRepository();
    inMemoryAssetRepository = new InMemoryAssetRepository();
    sut = new GetAssetPriceHistoryUseCase(inMemoryAssetRepository, inMemoryCDIRepository);

    const { assetsToCreate } = assetMocks;
    const { CDIToCreate } = CDIMocks;

    assetsToCreate.map((data) => inMemoryAssetRepository.create(data));
    CDIToCreate.map((data) => inMemoryCDIRepository.create(data));

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  
  it("should return the data correctly", async () => {
    const { FIRST_TICKER_OF_MOCKED_DATA } = assetMocks;
    
    const { cdiProfitability, tickerProfitability } = await sut.execute({
      ticker: FIRST_TICKER_OF_MOCKED_DATA,
      startDate: "26/01/2024",
      endDate: "29/01/2024",
    });

    expect(tickerProfitability.length).toBeGreaterThan(0);
    expect(cdiProfitability.length).toBeGreaterThan(0);
    
    expect(tickerProfitability).toEqual([
      {
        date: new Date("2024 01 29"),
        profitabilityDay: 1.3864229641614267
      }
    ]);
    expect(cdiProfitability).toEqual([
      {
        date: new Date("2024 01 29"),
        profitabilityDay: 1.00043739
      }
    ]);
  });

  it("should return Asset Not Find Error when passing an existent asset", async () => {
    const INEXISTENT_TICKER_IN_DB = "MSFT";

    await expect(() => sut.execute({
      ticker: INEXISTENT_TICKER_IN_DB,
      startDate: "26/01/2024",
      endDate: "29/01/2024",
    })).rejects.toBeInstanceOf(AssetNotFindError);
  });

  it("should return an error when does not have more than two interval days", async () => {
    const { FIRST_TICKER_OF_MOCKED_DATA } = assetMocks;

    const SATURDAY = "27/01/2024";
    const SUNDAY = "28/01/2024";

    await expect(() => sut.execute({
      ticker: FIRST_TICKER_OF_MOCKED_DATA,
      startDate: SATURDAY,
      endDate: SUNDAY,
    })).rejects.toBeInstanceOf(DateIntervalTooShortError);
  });
});

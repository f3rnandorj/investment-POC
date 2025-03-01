import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { GetAssetPriceHistoryUseCase } from "../getAssetPriceHistoryUseCase";
import { InMemoryAssetRepository, InMemoryCDIRepository } from "@/repositories/inMemory";
import { assetMocks, CDIMocks } from "@/mocks";
import { AssetNotFindError } from "@/errors";

let inMemoryCDIRepository: InMemoryCDIRepository;
let inMemoryAssetRepository: InMemoryAssetRepository;
let sut: GetAssetPriceHistoryUseCase;

describe("GetAssetPriceHistory Use Case", () => {
  beforeEach(() => {
    // process.env.TZ = "UTC";

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

    console.log(tickerProfitability);

    expect(tickerProfitability.length).toBeGreaterThan(0);
    expect(cdiProfitability.length).toBeGreaterThan(0);

    expect(tickerProfitability.map((item) => ({ 
      ...item, date: item.date.toISOString() 
    }))).toEqual([
      {
        date: "2024-01-29T03:00:00.000Z", 
        profitabilityDay: 1.3864229641614267
      }
    ]);
    expect(cdiProfitability).toEqual([
      {
        date: new Date("2024-01-26T03:00:00.000Z"),
        profitabilityDay: 1.00043739
      },
      {
        date: new Date("2024-01-29T03:00:00.000Z"),
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

  it("should return an empty array when does not have any registers in the interval of dates", async () => {
    const { FIRST_TICKER_OF_MOCKED_DATA } = assetMocks;

    const SATURDAY = "27/01/2024";
    const SUNDAY = "28/01/2024";

    const { cdiProfitability, tickerProfitability } = await sut.execute({
      ticker: FIRST_TICKER_OF_MOCKED_DATA,
      startDate: SATURDAY,
      endDate: SUNDAY,
    });

    expect(tickerProfitability.length).toEqual(0);
    expect(cdiProfitability.length).toEqual(0);
  });
});

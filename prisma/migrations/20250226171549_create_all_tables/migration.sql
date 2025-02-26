-- CreateTable
CREATE TABLE "assets" (
    "id" SERIAL NOT NULL,
    "symbol" TEXT NOT NULL,
    "long_name" TEXT NOT NULL,
    "short_name" TEXT NOT NULL,
    "exchange_name" TEXT NOT NULL,
    "full_exchange_name" TEXT NOT NULL,
    "instrument_type" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "first_trade_date" INTEGER NOT NULL,
    "regular_market_time" INTEGER NOT NULL,
    "regular_market_price" DOUBLE PRECISION NOT NULL,
    "fifty_two_week_high" DOUBLE PRECISION NOT NULL,
    "fifty_two_week_low" DOUBLE PRECISION NOT NULL,
    "regular_market_day_high" DOUBLE PRECISION NOT NULL,
    "regular_market_day_low" DOUBLE PRECISION NOT NULL,
    "regular_market_volume" INTEGER NOT NULL,
    "previous_close" DOUBLE PRECISION,
    "price_history" JSONB NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_infos" (
    "id" SERIAL NOT NULL,
    "asset_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subtype" TEXT NOT NULL,
    "bovespa_name" TEXT NOT NULL,

    CONSTRAINT "asset_infos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdis" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "cdis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assets_symbol_key" ON "assets"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "asset_infos_asset_code_key" ON "asset_infos"("asset_code");

-- CreateIndex
CREATE UNIQUE INDEX "cdis_date_key" ON "cdis"("date");

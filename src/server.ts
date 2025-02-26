import { app } from "./app";
import { env } from "./env";
import { prisma } from "./lib/prisma";

async function clearDatabase() {
  await prisma.asset.deleteMany({});
  await prisma.priceHistory.deleteMany({});
  await prisma.assetInfo.deleteMany({});
  await prisma.cdi.deleteMany({});
}

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(async () => {
    console.log("HTTP server running");
    // await clearDatabase()
  });

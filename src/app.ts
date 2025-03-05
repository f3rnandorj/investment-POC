import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "@/env";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { assetInfoRoutes, assetRoutes } from "./http";

export const app = fastify();

/*************************************************************** */
// SWAGGER DOCS
app.register(fastifySwagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "API investo-challenge",
      description: "Documentação da API",
      version: "0.1.0",
    },
    servers: [
      {
        url: process.env.NODE_ENV === "prod" ? "https://investo-challenge.onrender.com" : "http://localhost:3333",
        description: process.env.NODE_ENV === "prod" ? "Production server" : "Development server",
      }
    ],
    externalDocs: {
      url: "https://swagger.io",
      description: "Mais sobre o swagger aqui"
    },
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

/*************************************************************** */
// REGISTER ROUTES
app.register(assetRoutes);
app.register(assetInfoRoutes);

/*************************************************************** */
// ERROR HANDLING
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "prod") {
    console.error(error);
  } else {
    // Here we can log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
/*************************************************************** */
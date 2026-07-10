import "@/types/express.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "@/config/env.js";
import { logger } from "@/config/logger.js";
import { apiRouter } from "@/routes/index.js";
import { errorHandler, notFoundHandler } from "@/middlewares/index.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }

        const allowedOrigins = new Set([env.CLIENT_URL]);

        if (env.NODE_ENV === "development") {
          allowedOrigins.add("http://localhost:3000");
          allowedOrigins.add("http://127.0.0.1:3000");
        }

        const isLocalNetworkOrigin = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/.test(
          origin,
        );

        if (allowedOrigins.has(origin) || (env.NODE_ENV === "development" && isLocalNetworkOrigin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    morgan("dev", {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    }),
  );

  app.use("/api/v1", apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

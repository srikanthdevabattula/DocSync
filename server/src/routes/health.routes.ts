import { Router } from "express";
import { sendSuccess } from "@/utils/response.js";

const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  return sendSuccess(res, "Server is healthy", {
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export { healthRouter };

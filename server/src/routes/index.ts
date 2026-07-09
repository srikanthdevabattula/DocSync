import { Router } from "express";
import { authRouter } from "@/routes/auth.routes.js";
import { documentRouter } from "@/routes/document.routes.js";
import { healthRouter } from "@/routes/health.routes.js";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/documents", documentRouter);

export { apiRouter };

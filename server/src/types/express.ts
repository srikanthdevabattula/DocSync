import type { Request } from "express";
import type { JwtPayload } from "@/types/auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export type AuthenticatedRequest = Request & {
  user: JwtPayload;
};

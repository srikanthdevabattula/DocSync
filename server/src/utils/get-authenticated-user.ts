import type { Request } from "express";
import type { JwtPayload } from "@/types/auth.js";
import { AppError } from "@/utils/app-error.js";

export function getAuthenticatedUser(req: Request): JwtPayload {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  return req.user;
}

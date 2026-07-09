import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "@/utils/app-error.js";
import { logger } from "@/config/logger.js";
import { sendError } from "@/utils/response.js";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError("Route not found", 404));
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (error instanceof ZodError) {
    const errors = error.flatten().fieldErrors as Record<string, string[]>;
    return sendError(res, "Validation failed", 422, errors);
  }

  if (error instanceof AppError) {
    if (!error.isOperational) {
      logger.error("Non-operational error", { error });
    }

    return sendError(res, error.message, error.statusCode, error.errors);
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  ) {
    return sendError(res, "An account with this email already exists", 409);
  }

  logger.error("Unhandled error", {
    error,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  return sendError(res, "Internal server error", 500);
}

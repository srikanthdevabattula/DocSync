import type { NextFunction, Request, Response } from "express";
import { type ZodType } from "zod";

type RequestProperty = "body" | "query" | "params";

export const validate =
  <T>(schema: ZodType<T>, property: RequestProperty = "body") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[property]);
      req[property] = parsed as never;
      next();
    } catch (error) {
      next(error);
    }
  };

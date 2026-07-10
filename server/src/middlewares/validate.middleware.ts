import type { NextFunction, Request, RequestHandler, Response } from "express";
import { type ZodType } from "zod";

type RequestProperty = "body" | "query" | "params";

function assignValidatedValue<T>(req: Request, property: RequestProperty, value: T): void {
  switch (property) {
    case "body":
      req.body = value;
      return;
    case "query":
      req.query = value as Request["query"];
      return;
    case "params":
      req.params = value as Request["params"];
      return;
  }
}

export const validate = <T>(
  schema: ZodType<T>,
  property: RequestProperty = "body",
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[property]);
      assignValidatedValue(req, property, parsed);
      next();
    } catch (error) {
      next(error);
    }
  };
};

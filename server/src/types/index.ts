import type { JwtPayload } from "@/types/auth.js";

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export type { JwtPayload, TokenPair } from "@/types/auth.js";

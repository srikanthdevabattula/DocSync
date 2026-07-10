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

export type { JwtPayload, TokenPair } from "@/types/auth.js";
export type { AuthenticatedRequest } from "@/types/express.js";

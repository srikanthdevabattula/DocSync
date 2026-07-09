const AUTH_ERROR_PATTERNS = [
  "authentication required",
  "invalid or expired token",
  "invalid token",
  "unauthorized",
];

export class ApiError extends Error {
  statusCode?: number;
  isAuthError: boolean;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.isAuthError =
      statusCode === 401 ||
      AUTH_ERROR_PATTERNS.some((pattern) => message.toLowerCase().includes(pattern));
  }
}

export function isAuthError(error: unknown): boolean {
  return error instanceof ApiError && error.isAuthError;
}

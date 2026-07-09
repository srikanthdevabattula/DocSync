import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { appConfig } from "@/lib/env";
import { handleSessionExpired } from "@/lib/auth-session";
import { API_TIMEOUT_MS, STORAGE_KEYS } from "@/utils/constants";
import { ApiError } from "@/utils/api-error";
import type { ApiErrorResponse } from "@/types";

export const apiClient = axios.create({
  baseURL: appConfig.apiUrl,
  timeout: API_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const statusCode = error.response?.status;
    const message =
      error.response?.data?.message ?? error.message ?? "An unexpected error occurred";

    if (statusCode === 401) {
      handleSessionExpired();
    }

    return Promise.reject(new ApiError(message, statusCode));
  },
);

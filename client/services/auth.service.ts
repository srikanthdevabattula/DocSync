import { apiClient } from "@/services/api-client";
import type { ApiResponse } from "@/types";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

function unwrapAuthResponse(response: ApiResponse<AuthResponse>): AuthResponse {
  if (!response.data) {
    throw new Error(response.message || "Authentication failed");
  }

  return response.data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload);
  return unwrapAuthResponse(data);
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", payload);
  return unwrapAuthResponse(data);
}

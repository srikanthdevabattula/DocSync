import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authService from "@/services/auth.service";
import { clearAuthSession, isAccessTokenExpired } from "@/lib/auth-session";
import { STORAGE_KEYS } from "@/utils/constants";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/auth";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
};

const emptyAuthState = (): AuthState => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,
  error: null,
});

const readPersistedAuth = (): Pick<AuthState, "user" | "accessToken" | "refreshToken" | "isAuthenticated"> => {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  const userRaw = localStorage.getItem(STORAGE_KEYS.USER);

  let user: User | null = null;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw) as User;
    } catch {
      user = null;
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: Boolean(accessToken && user),
  };
};

const persistAuth = (response: AuthResponse, rememberMe = true) => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.tokens.accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refreshToken);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

  if (!rememberMe) {
    sessionStorage.setItem(STORAGE_KEYS.REMEMBER_ME, "false");
  } else {
    sessionStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  }
};

export const login = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.login(payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to sign in");
    }
  },
);

export const register = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: string }>(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      return await authService.register(payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to create account");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: emptyAuthState(),
  reducers: {
    hydrateAuth: (state) => {
      if (typeof window === "undefined" || state.isHydrated) {
        return;
      }

      const persisted = readPersistedAuth();

      if (persisted.accessToken && isAccessTokenExpired(persisted.accessToken)) {
        clearAuthSession();
        state.isHydrated = true;
        return;
      }

      Object.assign(state, persisted);
      state.isHydrated = true;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      clearAuthSession();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;
        state.isHydrated = true;
        persistAuth(action.payload, action.meta.arg.rememberMe);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to sign in";
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;
        state.isHydrated = true;
        persistAuth(action.payload, true);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to create account";
      });
  },
});

export const { hydrateAuth, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

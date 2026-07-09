import { STORAGE_KEYS } from "@/utils/constants";

let isHandlingUnauthorized = false;
let onSessionExpired: (() => void) | null = null;

export function registerSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

export function isAccessTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")),
    ) as { exp?: number };

    if (typeof payload.exp !== "number") return false;

    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  sessionStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
}

export function handleSessionExpired(): void {
  if (typeof window === "undefined" || isHandlingUnauthorized) return;

  isHandlingUnauthorized = true;
  clearAuthSession();
  onSessionExpired?.();

  const path = window.location.pathname;
  if (!path.startsWith("/login") && !path.startsWith("/register")) {
    window.location.replace("/login");
  }

  window.setTimeout(() => {
    isHandlingUnauthorized = false;
  }, 2000);
}

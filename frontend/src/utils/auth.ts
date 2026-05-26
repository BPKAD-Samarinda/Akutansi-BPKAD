import { jwtDecode } from "jwt-decode";

type AuthSyncMessage =
  | { type: "request-token" }
  | { type: "share-token"; token: string }
  | { type: "clear-token" };

let authSyncInitialized = false;
let authSyncChannel: BroadcastChannel | null = null;

export function getAuthToken(): string | null {
  return (
    sessionStorage.getItem("authToken") ?? localStorage.getItem("authToken")
  );
}

export function clearAuthToken(): void {
  sessionStorage.removeItem("authToken");
  localStorage.removeItem("authToken");
  authSyncChannel?.postMessage({ type: "clear-token" } satisfies AuthSyncMessage);
}

export function updateAuthToken(token: string): void {
  if (localStorage.getItem("authToken")) {
    localStorage.setItem("authToken", token);
  } else {
    sessionStorage.setItem("authToken", token);
  }
  authSyncChannel?.postMessage({ type: "share-token", token } satisfies AuthSyncMessage);
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  if (!token || token.trim().length === 0) {
    return false;
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded?.exp) {
      clearAuthToken();
      return false;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (decoded.exp <= nowInSeconds) {
      clearAuthToken();
      return false;
    }

    return true;
  } catch {
    clearAuthToken();
    return false;
  }
}

interface DecodedToken {
  id: number | string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export function getUser(): DecodedToken | null {
  const token = getAuthToken();
  if (!token) {
    return null;
  }
  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded;
  } catch {
    return null;
  }
}

export function sanitizeCredentialInput(value: string, maxLength: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function initAuthSync(): void {
  if (authSyncInitialized || typeof window === "undefined") {
    return;
  }

  authSyncInitialized = true;

  if (typeof BroadcastChannel === "undefined") {
    return;
  }

  authSyncChannel = new BroadcastChannel("bpkad-auth-sync");

  authSyncChannel.onmessage = (event: MessageEvent<AuthSyncMessage>) => {
    const payload = event.data;

    if (!payload || typeof payload !== "object") {
      return;
    }

    if (payload.type === "request-token") {
      const sessionToken = sessionStorage.getItem("authToken");
      const persistentToken = localStorage.getItem("authToken");

      if (sessionToken && !persistentToken) {
        authSyncChannel?.postMessage({
          type: "share-token",
          token: sessionToken,
        } satisfies AuthSyncMessage);
      }
      return;
    }

    if (payload.type === "share-token") {
      const hasToken = Boolean(getAuthToken());
      if (!hasToken && payload.token) {
        sessionStorage.setItem("authToken", payload.token);
      }
      return;
    }

    if (payload.type === "clear-token") {
      sessionStorage.removeItem("authToken");
      localStorage.removeItem("authToken");
    }
  };

  if (!getAuthToken()) {
    authSyncChannel.postMessage({ type: "request-token" } satisfies AuthSyncMessage);
  }
}

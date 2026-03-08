import { jwtDecode } from "jwt-decode";

export function getAuthToken(): string | null {
  return (
    sessionStorage.getItem("authToken") ?? localStorage.getItem("authToken")
  );
}

export function clearAuthToken(): void {
  sessionStorage.removeItem("authToken");
  localStorage.removeItem("authToken");
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return Boolean(token && token.trim().length > 0);
}

interface DecodedToken {
  id: string;
  nama: string;
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
  } catch (error) {
    console.error("Gagal mendekode token:", error);
    return null;
  }
}

export function sanitizeCredentialInput(value: string, maxLength: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

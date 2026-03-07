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

export function sanitizeCredentialInput(value: string, maxLength: number): string {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

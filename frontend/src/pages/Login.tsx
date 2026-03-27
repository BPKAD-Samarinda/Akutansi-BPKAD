// frontend/src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import AuthHero from "../components/layout/AuthHero";
import LoginForm from "../components/layout/LoginForm";
import { sanitizeCredentialInput } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    () => localStorage.getItem("rememberMe") === "true",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const safeUsername = sanitizeCredentialInput(username, 50);
    const safePassword = password.slice(0, 100);

    if (!safeUsername || !safePassword) {
      setError("Nama pengguna dan kata sandi wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await login(safeUsername, safePassword);
      localStorage.setItem("rememberMe", String(rememberMe));

      if (rememberMe) {
        localStorage.setItem("authToken", data.token);
        sessionStorage.removeItem("authToken");
      } else {
        sessionStorage.setItem("authToken", data.token);
        localStorage.removeItem("authToken");
      }

      navigate("/dashboard");
    } catch (err: Error | unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-100 dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <LoginForm
        username={username}
        password={password}
        rememberMe={rememberMe}
        isLoading={isLoading}
        error={error}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
        onRememberMeChange={setRememberMe}
        onSubmit={handleLogin}
      />
      <AuthHero />
    </div>
  );
}

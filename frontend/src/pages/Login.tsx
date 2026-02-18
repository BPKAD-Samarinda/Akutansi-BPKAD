import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import AuthHero from "../components/layout/AuthHero";
import LoginForm from "../components/layout/LoginForm";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await login(username, password);
      // Simpan token di localStorage untuk sesi
      localStorage.setItem("authToken", data.token);

      // Arahkan ke dasbor setelah berhasil login
      navigate("/dashboarddokumen");
    } catch (err: Error | unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-[#F6F6F6] font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden fixed inset-0">
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

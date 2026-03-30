// frontend/src/pages/Login.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import AuthHero from "../components/layout/AuthHero";
import LoginForm from "../components/layout/LoginForm";
import { sanitizeCredentialInput } from "../utils/auth";

type VantaNetInstance = {
  destroy?: () => void;
};

export default function Login() {
  const navigate = useNavigate();
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<VantaNetInstance | null>(null);
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

  useEffect(() => {
    let canceled = false;
    let observer: MutationObserver | null = null;

    const isDarkTheme = () =>
      document.documentElement.classList.contains("dark");

    const getVantaOptions = (dark: boolean) => ({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      color: dark ? 0xff8a2a : 0xff7a18,
      backgroundColor: dark ? 0x0b1225 : 0xf3f5f9,
      points: dark ? 7.5 : 7.0,
      maxDistance: dark ? 26.0 : 24.0,
      spacing: dark ? 21.0 : 22.0,
      showDots: true,
    });

    const destroyVanta = () => {
      if (vantaEffect.current?.destroy) {
        vantaEffect.current.destroy();
      }
      vantaEffect.current = null;
    };

    const initVanta = () => {
      const vanta = (window as typeof window & { VANTA?: any }).VANTA;
      if (!vanta?.NET || !vantaRef.current) return false;
      destroyVanta();
      vantaRef.current.style.opacity = "1";
      vantaEffect.current = vanta.NET(getVantaOptions(isDarkTheme()));
      return true;
    };

    const tryInit = () => {
      if (canceled) return;
      if (!initVanta()) {
        setTimeout(tryInit, 120);
      }
    };

    tryInit();

    observer = new MutationObserver(() => {
      if (!vantaRef.current) return;
      initVanta();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      canceled = true;
      observer?.disconnect();
      destroyVanta();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden">
      <div ref={vantaRef} className="absolute inset-y-0 left-0 w-full lg:w-1/2" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-1/2 bg-gradient-to-br from-white/60 via-white/25 to-white/8 dark:from-slate-950/80 dark:via-slate-950/35 dark:to-slate-900/10" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-1/2 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.12),_transparent_60%)] dark:bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.06),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-1/2 bg-gradient-to-r from-transparent via-transparent to-slate-900/15 dark:to-slate-950/25" />
      <div className="relative z-10 min-h-screen w-full flex bg-transparent">
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
    </div>
  );
}

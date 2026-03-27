import { useEffect } from "react";
import AppTooltip from "../ui/app-tooltip";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 1800,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    warning: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    info: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  const styles = {
    success:
      "bg-emerald-600/90 text-white border-emerald-200/30 shadow-emerald-900/40",
    error:
      "bg-rose-600/90 text-white border-rose-200/30 shadow-rose-900/40",
    warning:
      "bg-amber-500/90 text-white border-amber-200/30 shadow-amber-900/40",
    info: "bg-sky-600/90 text-white border-sky-200/30 shadow-sky-900/40",
  };

  const iconWrap = {
    success: "bg-emerald-200/20 ring-emerald-200/30",
    error: "bg-rose-200/20 ring-rose-200/30",
    warning: "bg-amber-200/20 ring-amber-200/30",
    info: "bg-sky-200/20 ring-sky-200/30",
  };

  const titles = {
    success: "Berhasil",
    error: "Gagal",
    warning: "Peringatan",
    info: "Info",
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
      <div
        className="relative w-full max-w-md pointer-events-auto animate-toastPop"
        style={{ "--toast-duration": `${duration}ms` } as React.CSSProperties}
      >
        <div
          className={`${styles[type]} relative overflow-hidden rounded-2xl border px-6 py-5 shadow-2xl backdrop-blur-md`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_60%)] opacity-80"></div>
          <div className="relative flex items-start gap-4">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${iconWrap[type]} animate-bounceOnce`}
            >
              {icons[type]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/90">
                {titles[type]}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-white/95">
                {message}
              </p>
            </div>
            <AppTooltip content="Close">
              <button
                onClick={onClose}
                title=""
                aria-label="Close"
                className="flex-shrink-0 rounded-lg p-1 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </AppTooltip>
          </div>

          <div className="absolute bottom-0 left-0 h-1 w-full bg-white/30">
            <div className="h-full w-full bg-white/70 animate-shrink"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

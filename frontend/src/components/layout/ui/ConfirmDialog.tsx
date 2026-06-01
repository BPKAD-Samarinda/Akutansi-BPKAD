import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const colors = {
    danger: {
      icon: "text-red-600",
      iconBg: "bg-red-100",
      button:
        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
    },
    warning: {
      icon: "text-yellow-600",
      iconBg: "bg-yellow-100",
      button:
        "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700",
    },
    info: {
      icon: "text-blue-600",
      iconBg: "bg-blue-100",
      button:
        "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    },
  };

  const theme = colors[type];

  const dialog = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeInFast">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
        onClick={onCancel}
      ></div>

      {/* Dialog */}
      <div className="relative bg-white dark:bg-slate-900 rounded-[28px] shadow-2xl max-w-[360px] w-full p-6 border border-gray-100 dark:border-slate-800/80 animate-scaleInFast">
        {/* Icon */}
        <div
          className={`w-12 h-12 ${theme.iconBg} dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounceOnce`}
        >
          <svg
            className={`w-6 h-6 ${theme.icon}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {type === "danger" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            )}
            {type === "warning" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            )}
            {type === "info" && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 text-center mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-gray-500 dark:text-slate-400 text-center mb-6 leading-relaxed text-xs">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 ${theme.button} text-white rounded-xl text-xs font-bold shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-lg`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

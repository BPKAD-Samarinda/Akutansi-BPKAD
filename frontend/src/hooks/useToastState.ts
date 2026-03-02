import { useState } from "react";
import { ToastState } from "../types";

export function useToastState(initialType: ToastState["type"] = "info") {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: initialType,
  });

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({
      show: true,
      message,
      type,
    });
  };

  const closeToast = () => {
    setToast((prev) => ({
      ...prev,
      show: false,
    }));
  };

  return {
    toast,
    setToast,
    showToast,
    closeToast,
  };
}

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("UI runtime error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6 text-center">
          <div className="max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h1 className="text-lg font-semibold text-slate-800">Terjadi kesalahan tampilan</h1>
            <p className="mt-2 text-sm text-slate-600">
              Muat ulang halaman. Jika masih berulang, hubungi admin dan kirim log error browser.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

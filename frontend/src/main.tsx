import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { initAuthSync } from "./utils/auth";
import ErrorBoundary from "./components/layout/ErrorBoundary";

initAuthSync();
const savedTheme = window.localStorage.getItem("theme");
const useDark = savedTheme ? savedTheme === "dark" : false;
document.documentElement.classList.toggle("dark", useDark);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import UploadDocument from "../pages/UploadDocument";

export default function AppRoutes() {
  const location = useLocation();

  // Debug logging
  useEffect(() => {
    console.log("=== ROUTING DEBUG ===");
    console.log("Current pathname:", location.pathname);
    console.log("Full URL:", window.location.href);
    console.log("====================");
  }, [location]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboarddokumen" element={<Dashboard />} />
      <Route path="/upload" element={<UploadDocument />} />

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
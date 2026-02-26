import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import UploadDocument from "../pages/UploadDocument";
import DocumentPreview from "../pages/DocumentPreview";

export default function AppRoutes() {
  const location = useLocation();

  // Debug logging
  useEffect(() => {}, [location]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboarddokumen" element={<Dashboard />} />
      <Route path="/upload" element={<UploadDocument />} />
      <Route path="/preview-document" element={<DocumentPreview />} />

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

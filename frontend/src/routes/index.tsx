import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DocumentManagement from "../pages/DocumentManagement";
import UploadDocument from "../pages/UploadDocument";
import DocumentPreview from "../pages/DocumentPreview";
import UploadHistory from "../pages/UploadHistory";

export default function AppRoutes() {
  const location = useLocation();

  useEffect(() => {}, [location]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dokumen-management" element={<DocumentManagement />} />
      <Route
        path="/dashboarddokumen"
        element={<Navigate to="/dokumen-management" replace />}
      />
      <Route path="/upload" element={<UploadDocument />} />
      <Route path="/riwayat" element={<UploadHistory />} />
      <Route path="/preview-document" element={<DocumentPreview />} />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

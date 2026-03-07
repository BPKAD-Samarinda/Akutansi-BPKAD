import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DocumentManagement from "../pages/DocumentManagement";
import UploadDocument from "../pages/UploadDocument";
import DocumentPreview from "../pages/DocumentPreview";
import UploadHistory from "../pages/UploadHistory";
import { isAuthenticated } from "../utils/auth";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function AppRoutes() {
  const location = useLocation();

  useEffect(() => {}, [location]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dokumen-management"
        element={
          <ProtectedRoute>
            <DocumentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboarddokumen"
        element={<Navigate to="/dokumen-management" replace />}
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadDocument />
          </ProtectedRoute>
        }
      />
      <Route
        path="/riwayat"
        element={
          <ProtectedRoute>
            <UploadHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/preview-document"
        element={
          <ProtectedRoute>
            <DocumentPreview />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

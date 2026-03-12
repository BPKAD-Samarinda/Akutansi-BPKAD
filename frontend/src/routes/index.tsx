import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import type { ReactElement } from "react";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DocumentManagement from "../pages/DocumentManagement";
import UploadDocument from "../pages/UploadDocument";
import DocumentPreview from "../pages/DocumentPreview";
import UploadHistory from "../pages/UploadHistory";
import { getUser, isAuthenticated } from "../utils/auth";

function ProtectedRoute({ children }: { children: ReactElement }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminOnlyRoute({ children }: { children: ReactElement }) {
  const user = getUser();

  if (!user || (user.role !== "Admin" && user.role !== "Admin Akuntansi")) {
    return <Navigate to="/dashboard" replace />;
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
            <AdminOnlyRoute>
              <UploadDocument />
            </AdminOnlyRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/riwayat"
        element={
          <ProtectedRoute>
            <AdminOnlyRoute>
              <UploadHistory />
            </AdminOnlyRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-user"
        element={
          <ProtectedRoute>
            <AdminOnlyRoute>
              <AddUser />
            </AdminOnlyRoute>
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
import AddUser from "../pages/AddUser";

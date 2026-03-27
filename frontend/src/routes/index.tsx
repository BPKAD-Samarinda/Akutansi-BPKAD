import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import type { ReactElement } from "react";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DocumentManagement from "../pages/DocumentManagement";
import UploadDocument from "../pages/UploadDocument";
import DocumentPreview from "../pages/DocumentPreview";
import UploadHistory from "../pages/UploadHistory";
import AddUser from "../pages/AddUser";
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

function MagangOrPklOrAdminRoute({ children }: { children: ReactElement }) {
  const user = getUser();
  const allowedRoles = [
    "Admin",
    "Admin Akuntansi",
    "Anak Magang",
    "Anak PKL",
  ];

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function DashboardAccessRoute({ children }: { children: ReactElement }) {
  const user = getUser();
  const allowedRoles = [
    "Admin",
    "Admin Akuntansi",
    "Staff",
    "Staff Akuntansi",
    "Anak Magang",
    "Anak PKL",
  ];

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AdminRoute({ children }: { children: ReactElement }) {
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
            <DashboardAccessRoute>
              <Dashboard />
            </DashboardAccessRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dokumen-management"
        element={
          <ProtectedRoute>
            <DashboardAccessRoute>
              <DocumentManagement />
            </DashboardAccessRoute>
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
            <MagangOrPklOrAdminRoute>
              <UploadDocument />
            </MagangOrPklOrAdminRoute>
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
            <AdminRoute>
              <AddUser />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/preview-document"
        element={
          <ProtectedRoute>
            <DashboardAccessRoute>
              <DocumentPreview />
            </DashboardAccessRoute>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

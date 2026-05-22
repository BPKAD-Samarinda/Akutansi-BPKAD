import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import type { ReactElement } from "react";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DocumentManagement from "../pages/DocumentManagement";

import DocumentPreview from "../pages/DocumentPreview";
import UploadHistory from "../pages/UploadHistory";
import AddUser from "../pages/AddUser";
import SkpPage from "../pages/SKP";
import { getUser, isAuthenticated } from "../utils/auth";

const normalizeRole = (role?: string): string => {
  const raw = String(role ?? "").trim().toLowerCase();
  if (!raw) return "";
  if (raw.includes("admin akuntansi")) return "admin akuntansi";
  if (raw.includes("staff akuntansi")) return "staff akuntansi";
  if (raw.includes("admin")) return "admin";
  if (raw.includes("staff")) return "staff";
  if (raw.includes("magang")) return "anak magang";
  if (raw.includes("pkl")) return "anak pkl";
  return raw;
};

const hasAnyRole = (role: string | undefined, allowedRoles: string[]) => {
  const normalized = normalizeRole(role);
  return allowedRoles.includes(normalized);
};

function ProtectedRoute({ children }: { children: ReactElement }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AdminOnlyRoute({ children }: { children: ReactElement }) {
  const user = getUser();

  if (!user || !hasAnyRole(user.role, ["admin", "admin akuntansi"])) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function MagangOrPklOrAdminRoute({ children }: { children: ReactElement }) {
  const user = getUser();
  const allowedRoles = [
    "admin",
    "admin akuntansi",
    "anak magang",
    "anak pkl",
  ];

  if (!user || !hasAnyRole(user.role, allowedRoles)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function DashboardAccessRoute({ children }: { children: ReactElement }) {
  const user = getUser();
  const allowedRoles = [
    "admin",
    "admin akuntansi",
    "staff",
    "staff akuntansi",
    "anak magang",
    "anak pkl",
  ];

  if (!user || !hasAnyRole(user.role, allowedRoles)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }: { children: ReactElement }) {
  const user = getUser();

  if (!user || !hasAnyRole(user.role, ["admin", "admin akuntansi"])) {
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
        path="/skp"
        element={
          <ProtectedRoute>
            <DashboardAccessRoute>
              <SkpPage />
            </DashboardAccessRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/skp-history"
        element={<Navigate to="/riwayat" replace />}
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

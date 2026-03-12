import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Toast } from "../components/snackbar";
import type { ToastState } from "../types";
import ConfirmDialog from "../components/layout/ui/ConfirmDialog";
import AddUserForm from "../components/add-user/AddUserForm";
import EditUserModal from "../components/add-user/EditUserModal";
import UserStats from "../components/add-user/UserStats";
import UserTable from "../components/add-user/UserTable";
import type { AddUserFormValues, UserItem, UserRole } from "./AddUser.types";

export default function AddUser() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info",
  });
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: 1,
      username: "admin",
      role: "Admin Akuntansi",
      createdAt: "2026-02-11",
    },
    {
      id: 2,
      username: "staff",
      role: "Staff Akuntansi",
      createdAt: "2026-02-11",
    },
  ]);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const [form, setForm] = useState<AddUserFormValues>({
    username: "",
    password: "",
    role: "Staff Akuntansi",
  });

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
  };

  const summary = useMemo(() => {
    const total = users.length;
    const adminCount = users.filter((user) => user.role === "Admin Akuntansi").length;
    const staffCount = total - adminCount;
    return { total, adminCount, staffCount };
  }, [users]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      showToast("Nama pengguna dan kata sandi wajib diisi.", "warning");
      return;
    }

    const exists = users.some(
      (user) => user.username.toLowerCase() === form.username.trim().toLowerCase(),
    );
    if (exists) {
      showToast("Nama pengguna sudah digunakan.", "error");
      return;
    }

    const nextUser: UserItem = {
      id: Math.max(0, ...users.map((user) => user.id)) + 1,
      username: form.username.trim(),
      role: form.role,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setUsers((prev) => [nextUser, ...prev]);
    setForm({ username: "", password: "", role: "Staff Akuntansi" });
    showToast("Pengguna berhasil ditambahkan.", "success");
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    if (!editingUser.username.trim()) {
      showToast("Nama pengguna tidak boleh kosong.", "warning");
      return;
    }

    const exists = users.some(
      (user) =>
        user.id !== editingUser.id &&
        user.username.toLowerCase() === editingUser.username.trim().toLowerCase(),
    );
    if (exists) {
      showToast("Nama pengguna sudah digunakan.", "error");
      return;
    }

    setUsers((prev) =>
      prev.map((user) => (user.id === editingUser.id ? editingUser : user)),
    );
    setEditingUser(null);
    showToast("Pengguna berhasil diperbarui.", "success");
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setUsers((prev) => prev.filter((user) => user.id !== deleteTarget.id));
    setDeleteTarget(null);
    setIsDeleteOpen(false);
    showToast("Pengguna berhasil dihapus.", "success");
  };

  const handleEditUsername = (value: string) => {
    setEditingUser((prev) => (prev ? { ...prev, username: value } : prev));
  };

  const handleEditRole = (value: UserRole) => {
    setEditingUser((prev) => (prev ? { ...prev, role: value } : prev));
  };

  return (
    <div className="min-h-screen flex bg-[#F6F6F6] font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar />

      <div className="ml-20 lg:ml-[88px] flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="Tambah Pengguna" />

        <main className="flex-1 p-4 lg:p-8">
          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_1.85fr] gap-6">
            <div className="space-y-6 animate-[slideUp_0.6s_ease-out_0.1s_both]">
              <UserStats
                total={summary.total}
                adminCount={summary.adminCount}
                staffCount={summary.staffCount}
              />
              <AddUserForm
                form={form}
                onChange={handleChange}
                onSubmit={handleSubmit}
                onCancel={() => navigate("/dashboard")}
              />
            </div>

            <div className="animate-[slideUp_0.6s_ease-out_0.15s_both]">
              <UserTable
                users={users}
                onEdit={handleOpenEdit}
                onDelete={(user) => {
                  setDeleteTarget(user);
                  setIsDeleteOpen(true);
                }}
              />
            </div>
          </div>
        </main>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveEdit}
          onChangeUsername={handleEditUsername}
          onChangeRole={handleEditRole}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Hapus Pengguna?"
        message={`Apakah Anda yakin ingin menghapus "${deleteTarget?.username ?? ""}"?`}
        confirmText="Hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeleteTarget(null);
        }}
        type="danger"
      />
    </div>
  );
}

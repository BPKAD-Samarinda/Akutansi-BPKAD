import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Toast } from "../components/snackbar";
import ConfirmDialog from "../components/layout/ui/ConfirmDialog";
import AddUserModal from "../components/add-user/AddUserModal";
import EditUserModal from "../components/add-user/EditUserModal";
import UserStats from "../components/add-user/UserStats";
import UserTable from "../components/add-user/UserTable";
import { createUser, deleteUser, getUsers, updateUser } from "../services/api";
import type { ToastState } from "../types";
import type { AddUserFormValues, UserItem, UserRole } from "../hooks/add-user/types";
import { toUserItem } from "../hooks/add-user/mapper";

export default function AddUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editingPassword, setEditingPassword] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState<AddUserFormValues>({
    username: "",
    password: "",
    role: "Staff",
  });
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "info",
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);
  const summary = useMemo(() => {
    const total = users.length;
    const adminCount = users.filter((user) =>
      ["Admin", "Admin Akuntansi"].includes(user.role),
    ).length;
    const staffCount = users.filter((user) =>
      ["Staff", "Staff Akuntansi"].includes(user.role),
    ).length;
    const magangCount = users.filter((user) =>
      user.role.toLowerCase().includes("magang"),
    ).length;
    const pklCount = users.filter((user) =>
      user.role.toLowerCase().includes("pkl"),
    ).length;
    return { total, adminCount, staffCount, magangCount, pklCount };
  }, [users]);

  const normalizeRole = (value: string): UserRole => {
    const raw = (value ?? "").toString().trim().toLowerCase();
    if (raw.includes("admin")) return "Admin";
    if (raw.includes("staff")) return "Staff";
    if (raw.includes("magang")) return "Anak Magang";
    if (raw.includes("pkl")) return "Anak PKL";
    return "Staff";
  };

  const handleOpenEdit = (user: UserItem) => {
    setEditingUser({ ...user, role: normalizeRole(user.role) });
    setEditingPassword("");
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      setLoadError(null);
      setIsLoadingUsers(true);
      const timeoutId = window.setTimeout(() => {
        if (controller.signal.aborted) return;
        setIsLoadingUsers(false);
        setLoadError(
          "Tidak bisa terhubung ke server. Pastikan backend berjalan dan Anda login sebagai Admin.",
        );
      }, 12000);
      try {
        const data = await getUsers(controller.signal);
        if (controller.signal.aborted) return;
        const list = Array.isArray(data) ? data : [];
        setUsers(list.map(toUserItem));
        setIsLoadingUsers(false);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Get users error:", error);
        if (!controller.signal.aborted) {
          const status = (error as any)?.response?.status;
          const message =
            (error as any)?.response?.data?.message ??
            (status === 403
              ? "Akses ditolak. Pastikan login sebagai Admin."
              : "Gagal mengambil data pengguna.");
          setLoadError(message);
          showToast(message, "error");
        }
      } finally {
        window.clearTimeout(timeoutId);
        if (!controller.signal.aborted) setIsLoadingUsers(false);
      }
    };

    fetchUsers();
    return () => {
      controller.abort();
    };
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: AddUserFormValues["role"]) => {
    setForm((prev) => ({ ...prev, role: value }));
  };

  const showToast = (message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      showToast("Nama pengguna dan kata sandi wajib diisi.", "warning");
      return;
    }

    const submit = async () => {
      try {
        await createUser({
          username: form.username.trim(),
          password: form.password,
          role: normalizeRole(form.role),
        });
        const data = await getUsers();
        setUsers(data.map(toUserItem));
        setForm({ username: "", password: "", role: "Staff" });
        setIsAddOpen(false);
        showToast("Pengguna berhasil ditambahkan.", "success");
      } catch (error: any) {
        const message =
          error?.response?.data?.message ?? "Gagal menambahkan pengguna.";
        showToast(message, "error");
      }
    };

    submit();
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    const submit = async () => {
      try {
        const result = await updateUser(editingUser.id, {
          username: editingUser.username,
          role: normalizeRole(editingUser.role),
          ...(editingPassword.trim() ? { password: editingPassword } : {}),
        });
        if (result.user) {
          const updated = toUserItem(result.user);
          setUsers((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item)),
          );
        } else {
          const data = await getUsers();
          setUsers(data.map(toUserItem));
        }
        setEditingUser(null);
        setEditingPassword("");
        showToast("Pengguna berhasil diperbarui.", "success");
      } catch (error: any) {
        const message =
          error?.response?.data?.message ?? "Gagal memperbarui pengguna.";
        showToast(message, "error");
      }
    };

    submit();
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const submit = async () => {
      try {
        await deleteUser(deleteTarget.id);
        const data = await getUsers();
        setUsers(data.map(toUserItem));
        setDeleteTarget(null);
        setIsDeleteOpen(false);
        showToast("Pengguna berhasil dihapus.", "success");
      } catch (error: any) {
        const message =
          error?.response?.data?.message ?? "Gagal menghapus pengguna.";
        showToast(message, "error");
      }
    };

    submit();
  };

  const handleEditUsername = (value: string) => {
    setEditingUser((prev) => (prev ? { ...prev, username: value } : prev));
  };

  const handleEditRole = (value: UserRole) => {
    setEditingUser((prev) => (prev ? { ...prev, role: value } : prev));
  };

  const handleEditPassword = (value: string) => {
    setEditingPassword(value);
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="ml-0 lg:ml-64 flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
        <Header title="Tambah Pengguna" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between animate-[slideUp_0.6s_ease-out_0.05s_both]">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pengguna & Staff</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manajemen sumber daya pengguna dan admin.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 transition-colors"
            >
              <span className="text-lg leading-none">+</span>
              Tambah Pengguna
            </button>
          </div>
          <div className="space-y-6">
            <UserStats
              total={summary.total}
              adminCount={summary.adminCount}
              staffCount={summary.staffCount}
              magangCount={summary.magangCount}
              pklCount={summary.pklCount}
            />

            <div className="animate-[slideUp_0.6s_ease-out_0.1s_both]">
              {isLoadingUsers && users.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-500">
                  Memuat data pengguna...
                </div>
              ) : loadError && users.length === 0 ? (
                <div className="bg-white rounded-2xl border border-rose-100 p-8 text-center text-rose-500">
                  {loadError}
                </div>
              ) : (
                <UserTable
                  users={users}
                  onEdit={handleOpenEdit}
                  onDelete={(user) => {
                    setDeleteTarget(user);
                    setIsDeleteOpen(true);
                  }}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          password={editingPassword}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveEdit}
          onChangeUsername={handleEditUsername}
          onChangePassword={handleEditPassword}
          onChangeRole={handleEditRole}
        />
      )}

      <AddUserModal
        isOpen={isAddOpen}
        form={form}
        onChange={handleChange}
        onRoleChange={handleRoleChange}
        onSubmit={handleSubmit}
        onClose={() => setIsAddOpen(false)}
      />

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast({ ...toast, show: false })}
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

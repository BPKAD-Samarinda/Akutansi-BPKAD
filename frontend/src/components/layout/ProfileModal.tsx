import { useState, useEffect, useRef } from "react";
import { FiX, FiUser, FiLock, FiCheck } from "react-icons/fi";
import gsap from "gsap";
import { getUser, updateAuthToken } from "../../utils/auth";
import { updateUserProfile } from "../../services/api";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string, type: "success" | "error" | "info" | "warning") => void;
};

export default function ProfileModal({ isOpen, onClose, showToast }: ProfileModalProps) {
  const user = getUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setUsername(user.username);
      setPassword("");
      setConfirmPassword("");

      // GSAP Animation
      if (overlayRef.current && modalRef.current) {
        gsap.set(overlayRef.current, { autoAlpha: 0 });
        gsap.set(modalRef.current, { autoAlpha: 0, y: 15, scale: 0.98 });

        gsap.timeline()
          .to(overlayRef.current, { autoAlpha: 1, duration: 0.2, ease: "power2.out" })
          .to(modalRef.current, { autoAlpha: 1, y: 0, scale: 1, duration: 0.25, ease: "power2.out" }, "<");
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      gsap.timeline({ onComplete: onClose })
        .to(modalRef.current, { autoAlpha: 0, y: 10, scale: 0.98, duration: 0.16, ease: "power2.in" })
        .to(overlayRef.current, { autoAlpha: 0, duration: 0.16, ease: "power2.in" }, "<");
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = username.trim();
    if (!cleanUsername) {
      showToast("Nama pengguna tidak boleh kosong!", "warning");
      return;
    }

    if (password) {
      if (password.length < 4) {
        showToast("Kata sandi baru minimal harus 4 karakter!", "warning");
        return;
      }
      if (password !== confirmPassword) {
        showToast("Konfirmasi kata sandi tidak cocok!", "warning");
        return;
      }
    }

    setIsSaving(true);
    try {
      const response = await updateUserProfile({
        username: cleanUsername,
        password: password || undefined,
      });

      updateAuthToken(response.token);
      showToast("Profil berhasil diperbarui!", "success");

      setTimeout(() => {
        handleClose();
        window.location.reload();
      }, 800);

    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || "Gagal memperbarui profil";
      showToast(errorMsg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-[fadeIn_0.2s_ease-out]">
      <div
        ref={overlayRef}
        onClick={handleClose}
        className="absolute inset-0 bg-transparent cursor-pointer"
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-md flex flex-col overflow-hidden rounded-[28px] bg-white shadow-2xl dark:bg-slate-900 dark:ring-1 dark:ring-slate-800"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Pengaturan Profil</h2>
              <p className="text-xs text-orange-100 mt-1">Ubah nama pengguna atau kata sandi Anda</p>
            </div>
            <button
              onClick={handleClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/20 transition-all"
            >
              <FiX className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Nama Pengguna
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FiUser className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nama pengguna baru"
                className="h-11 w-full pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Peran Anda
            </label>
            <div className="h-11 w-full flex items-center px-4 rounded-xl border border-slate-100 bg-slate-50/50 text-sm text-slate-400 select-none dark:border-slate-800 dark:bg-slate-950/50">
              {user?.role ?? "-"}
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-800 my-4" />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Kata Sandi Baru (Opsional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <FiLock className="h-4 w-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kosongkan jika tidak ingin diubah"
                className="h-11 w-full pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>
          </div>

          {password && (
            <div className="animate-[slideDown_0.2s_ease-out]">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <FiLock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="h-11 w-full pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600 transition disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : (
                <>
                  <FiCheck className="h-4 w-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

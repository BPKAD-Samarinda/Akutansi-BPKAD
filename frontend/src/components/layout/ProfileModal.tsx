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
      if (password.length < 6) {
        showToast("Kata sandi baru minimal harus 6 karakter!", "warning");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
      <div
        ref={overlayRef}
        onClick={handleClose}
        className="absolute inset-0 bg-transparent cursor-pointer"
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-md flex flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800"
      >
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 dark:bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/15 dark:bg-orange-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        {/* Header */}
        <div className="relative px-8 pt-8 pb-4 text-slate-800 dark:text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30">
                <span className="text-xl font-bold uppercase">
                  {user?.username?.charAt(0) || "U"}
                </span>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500 dark:border-slate-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Profil Saya
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Atur informasi akun Anda
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative px-8 pb-8 space-y-5">
          <div>
            <label className="block text-[13px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 ml-1">
              Nama Pengguna
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-orange-500 transition-colors">
                <FiUser className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nama pengguna baru"
                className="h-12 w-full pl-11 pr-4 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm text-sm font-medium text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:focus:border-orange-500 dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 ml-1">
              Peran Akun
            </label>
            <div className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
              <div className="h-2 w-2 rounded-full bg-orange-500 mr-2 animate-pulse" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {user?.role ?? "-"}
              </span>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent my-6" />

          <div>
            <label className="block text-[13px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 ml-1">
              Kata Sandi Baru
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-orange-500 transition-colors">
                <FiLock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kosongkan jika tidak ingin diubah"
                className="h-12 w-full pl-11 pr-4 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm text-sm font-medium text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:focus:border-orange-500 dark:focus:bg-slate-900"
              />
            </div>
          </div>

          {password && (
            <div className="animate-[slideDown_0.3s_ease-out_forwards] origin-top">
              <label className="block text-[13px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 ml-1">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <FiLock className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi kata sandi baru"
                  className="h-12 w-full pl-11 pr-4 rounded-xl border border-slate-200 bg-white/50 backdrop-blur-sm text-sm font-medium text-slate-800 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/10 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100 dark:focus:border-orange-500 dark:focus:bg-slate-900"
                />
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-6 mt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="relative overflow-hidden inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isSaving ? "Menyimpan..." : (
                <>
                  <FiCheck className="h-4.5 w-4.5" />
                  Simpan Profil
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

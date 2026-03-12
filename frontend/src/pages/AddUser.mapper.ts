import type { UserItem } from "./AddUser.types";

const normalizeRole = (role: string | null | undefined): UserItem["role"] => {
  const raw = (role ?? "").toString().trim().toLowerCase();
  if (!raw) return "Staff";
  if (raw.includes("admin")) return "Admin";
  if (raw.includes("staff")) return "Staff";
  if (raw.includes("magang")) return "Anak Magang";
  if (raw.includes("pkl")) return "Anak PKL";
  return "Staff";
};

export const toUserItem = (user: {
  id: number;
  username: string;
  role: string;
  created_at: string;
}): UserItem => ({
  id: user.id,
  username: user.username,
  role: normalizeRole(user.role),
  createdAt: user.created_at ?? "",
});

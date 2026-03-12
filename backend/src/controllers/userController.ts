import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import db from "../config/db";

const normalizeRole = (value?: string) => {
  const raw = (value ?? "").toString().trim().toLowerCase();
  if (!raw) return "";
  if (raw.includes("admin")) return "Admin";
  if (raw.includes("staff")) return "Staff";
  if (raw.includes("magang")) return "Anak Magang";
  if (raw.includes("pkl")) return "Anak PKL";
  return "";
};

const ensureUsersTable = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  try {
    await db.execute("ALTER TABLE users MODIFY role VARCHAR(50) NOT NULL");
  } catch (error) {
    console.error("Alter role column error:", error);
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    await ensureUsersTable();
    const [rows]: any = await db.query(
      `SELECT 
        id,
        username,
        CASE 
          WHEN role = 'Admin Akuntansi' THEN 'Admin'
          WHEN role = 'Staff Akuntansi' THEN 'Staff'
          WHEN LOWER(role) LIKE '%pkl%' THEN 'Anak PKL'
          WHEN LOWER(role) LIKE '%magang%' THEN 'Anak Magang'
          WHEN role IS NULL OR role = '' THEN 'Staff'
          ELSE role
        END AS role,
        created_at
       FROM users
       ORDER BY created_at DESC, id DESC`,
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ message: "Gagal mengambil data pengguna" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { username, password, role } = req.body as {
    username?: string;
    password?: string;
    role?: string;
  };

  const normalizedRole = normalizeRole(role);

  if (!username || !password || !normalizedRole) {
    return res.status(400).json({ message: "Nama pengguna, kata sandi, dan peran wajib diisi" });
  }

  const allowedRoles = ["Admin", "Staff", "Anak Magang", "Anak PKL"];
  if (!allowedRoles.includes(normalizedRole)) {
    return res.status(400).json({ message: "Peran tidak valid" });
  }

  try {
    await ensureUsersTable();
    const [existing]: any = await db.query(
      "SELECT id FROM users WHERE username = ?",
      [username.trim()],
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Nama pengguna sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username.trim(), hashedPassword, normalizedRole],
    );

    return res.status(201).json({ message: "Pengguna berhasil ditambahkan" });
  } catch (error) {
    console.error("Create user error:", error);
    return res.status(500).json({ message: "Gagal menambahkan pengguna" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, role, password } = req.body as {
    username?: string;
    role?: string;
    password?: string;
  };

  const normalizedRole = normalizeRole(role);

  if (!username || !normalizedRole) {
    return res.status(400).json({ message: "Nama pengguna dan peran wajib diisi" });
  }

  const allowedRoles = ["Admin", "Staff", "Anak Magang", "Anak PKL"];
  if (!allowedRoles.includes(normalizedRole)) {
    return res.status(400).json({ message: "Peran tidak valid" });
  }

  try {
    await ensureUsersTable();

    const [existing]: any = await db.query(
      "SELECT id FROM users WHERE username = ? AND id <> ?",
      [username.trim(), id],
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Nama pengguna sudah digunakan" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.execute(
        "UPDATE users SET username = ?, role = ?, password = ? WHERE id = ?",
        [username.trim(), normalizedRole, hashedPassword, id],
      );
    } else {
      await db.execute(
        "UPDATE users SET username = ?, role = ? WHERE id = ?",
        [username.trim(), normalizedRole, id],
      );
    }

    const [rows]: any = await db.query(
      `SELECT 
        id,
        username,
        CASE 
          WHEN role = 'Admin Akuntansi' THEN 'Admin'
          WHEN role = 'Staff Akuntansi' THEN 'Staff'
          WHEN LOWER(role) LIKE '%pkl%' THEN 'Anak PKL'
          WHEN LOWER(role) LIKE '%magang%' THEN 'Anak Magang'
          WHEN role IS NULL OR role = '' THEN 'Staff'
          ELSE role
        END AS role,
        created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [id],
    );

    return res.status(200).json({
      message: "Pengguna berhasil diperbarui",
      user: rows?.[0] ?? null,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Gagal memperbarui pengguna" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await ensureUsersTable();
    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    return res.status(200).json({ message: "Pengguna berhasil dihapus" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ message: "Gagal menghapus pengguna" });
  }
};

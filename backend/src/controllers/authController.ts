import { Request, Response } from 'express';
import pool from '../config/db';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { getJwtSecret } from "../config/jwt";

const ensureUsersTable = async () => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const ensureLoginActivitiesTable = async () => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS login_activities (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      user_id BIGINT NULL,
      username VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      login_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_login_activities_login_at (login_at),
      INDEX idx_login_activities_user_id (user_id)
    )
  `);
};

export const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nama pengguna dan kata sandi harus diisi' });
  }

  try {
    await ensureUsersTable();
    const [rows]: any[] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Kombinasi nama pengguna dan kata sandi salah' });
    }

    const user = rows[0];

    const storedPassword = String(user.password ?? "");
    const isHashPassword = /^\$2[aby]\$\d{2}\$/.test(storedPassword);

    let isPasswordMatch = false;
    if (isHashPassword) {
      isPasswordMatch = await bcrypt.compare(password, storedPassword);
    } else {
      // Transitional path: support legacy plaintext once, then upgrade to bcrypt hash.
      isPasswordMatch = password === storedPassword;
      if (isPasswordMatch) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute("UPDATE users SET password = ? WHERE id = ?", [
          hashedPassword,
          user.id,
        ]);
      }
    }

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Kombinasi nama pengguna dan kata sandi salah' });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const secretKey = getJwtSecret();
    const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });

    await ensureLoginActivitiesTable();
    await pool.execute(
      "INSERT INTO login_activities (user_id, username, role, login_at) VALUES (?, ?, ?, NOW())",
      [user.id ?? null, user.username, user.role],
    );

    res.status(200).json({
      message: 'Login berhasil',
      token: token,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

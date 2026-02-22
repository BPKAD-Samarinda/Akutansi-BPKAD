import { Request, Response } from 'express';
import pool from '../config/db';
// import bcrypt from 'bcrypt';belom kunyalakan
import jwt from 'jsonwebtoken';

export const loginController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nama pengguna dan kata sandi harus diisi' });
  }

  try {
    const [rows]: any[] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Kombinasi nama pengguna dan kata sandi salah' });
    }

    const user = rows[0];

    // const isPasswordMatch = await bcrypt.compare(password, user.password);
    const isPasswordMatch = password === user.password;

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Kombinasi nama pengguna dan kata sandi salah' });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const secretKey = process.env.JWT_SECRET || 'nuno123';
    const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Login berhasil',
      token: token,
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

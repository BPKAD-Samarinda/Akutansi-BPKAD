"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = void 0;
const db_1 = __importDefault(require("../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const loginController = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Nama pengguna dan kata sandi harus diisi' });
    }
    try {
        const [rows] = await db_1.default.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Kombinasi nama pengguna dan kata sandi salah' });
        }
        const user = rows[0];
        const isPasswordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Kombinasi nama pengguna dan kata sandi salah' });
        }
        const payload = {
            id: user.id,
            username: user.username,
        };
        const secretKey = process.env.JWT_SECRET || 'nuno123';
        const token = jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: '1d' });
        res.status(200).json({
            message: 'Login berhasil',
            token: token,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};
exports.loginController = loginController;
//# sourceMappingURL=authController.js.map
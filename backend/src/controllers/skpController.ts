import { Request, Response } from "express";
import db from "../config/db";

type AuthenticatedRequest = Request & {
  user?: {
    username?: string;
    role?: string;
  };
};

const ensureSkpTable = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS skp_documents (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      nama_skp VARCHAR(255) NOT NULL,
      triwulan TINYINT NOT NULL,
      tahun INT NOT NULL,
      file_path VARCHAR(255) NOT NULL,
      uploaded_by VARCHAR(255) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_skp_triwulan (triwulan),
      INDEX idx_skp_tahun (tahun),
      INDEX idx_skp_uploaded_by (uploaded_by),
      INDEX idx_skp_created_at (created_at)
    )
  `);
};

export const getSkpDocuments = async (req: Request, res: Response) => {
  try {
    await ensureSkpTable();

    const triwulan = Number(req.query.triwulan || 0);
    const tahun = Number(req.query.tahun || 0);
    const search = String(req.query.search || "").trim();

    const clauses: string[] = [];
    const values: Array<string | number> = [];

    if (triwulan >= 1 && triwulan <= 4) {
      clauses.push("triwulan = ?");
      values.push(triwulan);
    }

    if (tahun >= 2000 && tahun <= 3000) {
      clauses.push("tahun = ?");
      values.push(tahun);
    }

    if (search.length > 0) {
      clauses.push("LOWER(uploaded_by) LIKE ?");
      values.push(`%${search.toLowerCase()}%`);
    }

    const whereSql = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";

    const [rows] = await db.query(
      `SELECT id, nama_skp, triwulan, tahun, file_path, uploaded_by, created_at
       FROM skp_documents
       ${whereSql}
       ORDER BY tahun DESC, triwulan DESC, created_at DESC, id DESC`,
      values,
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Get SKP documents error:", error);
    return res.status(500).json({ message: "Gagal mengambil data SKP" });
  }
};

export const createSkpDocument = async (req: Request, res: Response) => {
  try {
    await ensureSkpTable();

    const { nama_skp, triwulan, tahun } = req.body as {
      nama_skp?: string;
      triwulan?: string | number;
      tahun?: string | number;
    };

    if ((req as any).fileValidationError) {
      return res.status(400).json({ message: (req as any).fileValidationError });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File dokumen SKP wajib diunggah." });
    }

    const parsedTriwulan = Number(triwulan);
    const parsedTahun = Number(tahun);
    const trimmedNamaSkp = String(nama_skp || "").trim();

    if (!trimmedNamaSkp) {
      return res.status(400).json({ message: "Nama SKP wajib diisi." });
    }

    if (![1, 2, 3, 4].includes(parsedTriwulan)) {
      return res.status(400).json({ message: "Triwulan harus antara 1 sampai 4." });
    }

    if (Number.isNaN(parsedTahun) || parsedTahun < 2000 || parsedTahun > 3000) {
      return res.status(400).json({ message: "Tahun tidak valid." });
    }

    const uploaderName =
      (req as AuthenticatedRequest).user?.username ||
      (req as AuthenticatedRequest).user?.role ||
      "-";

    const filePath = `uploads/${req.file.filename}`;

    const [result] = await db.execute(
      `INSERT INTO skp_documents (nama_skp, triwulan, tahun, file_path, uploaded_by)
       VALUES (?, ?, ?, ?, ?)`,
      [trimmedNamaSkp, parsedTriwulan, parsedTahun, filePath, uploaderName],
    );

    return res.status(201).json({
      message: "Dokumen SKP berhasil diunggah.",
      data: {
        id: (result as any)?.insertId,
      },
    });
  } catch (error) {
    console.error("Create SKP document error:", error);
    return res.status(500).json({ message: "Gagal mengunggah dokumen SKP" });
  }
};

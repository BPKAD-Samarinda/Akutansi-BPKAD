import { Request, Response } from "express";
import db from "../config/db";
import fs from "fs";
import path from "path";
import type { PoolConnection } from "mysql2/promise";
import { BACKEND_UPLOADS_DIR, ROOT_UPLOADS_DIR } from "../config/uploadPaths";

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
  const [indexRows] = await db.query(
    `SELECT 1
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'skp_documents'
       AND INDEX_NAME = 'uniq_skp_uploader_period_name'
     LIMIT 1`,
  );
  if ((indexRows as Record<string, unknown>[]).length === 0) {
    await db.execute(
      "CREATE UNIQUE INDEX uniq_skp_uploader_period_name ON skp_documents (uploaded_by, tahun, triwulan, nama_skp)",
    );
  }
};

const ensureSkpSoftDeleteColumns = async () => {
  try { await db.execute("ALTER TABLE skp_documents ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0"); } catch (e) {}
  try { await db.execute("ALTER TABLE skp_documents ADD COLUMN deleted_at DATETIME NULL"); } catch (e) {}
  try { await db.execute("DROP INDEX uniq_skp_uploader_period_name ON skp_documents"); } catch (e) {}
};

const ensureSkpHistoryTable = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS skp_history (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      skp_document_id BIGINT NULL,
      action_type VARCHAR(20) NOT NULL,
      actor_username VARCHAR(255) NULL,
      actor_role VARCHAR(50) NULL,
      target_uploaded_by VARCHAR(255) NULL,
      before_data TEXT NULL,
      after_data TEXT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_skp_history_action_type (action_type),
      INDEX idx_skp_history_actor_username (actor_username),
      INDEX idx_skp_history_target_uploaded_by (target_uploaded_by),
      INDEX idx_skp_history_created_at (created_at)
    )
  `);
};

const writeSkpHistory = async (
  executor: PoolConnection | typeof db,
  payload: {
  skpDocumentId?: number | string | null;
  actionType: "upload" | "edit" | "delete";
  actorUsername?: string | null;
  actorRole?: string | null;
  targetUploadedBy?: string | null;
  beforeData?: Record<string, unknown> | null;
  afterData?: Record<string, unknown> | null;
}) => {
  await ensureSkpHistoryTable();
  await executor.execute(
    `INSERT INTO skp_history
      (skp_document_id, action_type, actor_username, actor_role, target_uploaded_by, before_data, after_data)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.skpDocumentId ?? null,
      payload.actionType,
      payload.actorUsername ?? null,
      payload.actorRole ?? null,
      payload.targetUploadedBy ?? null,
      payload.beforeData ? JSON.stringify(payload.beforeData) : null,
      payload.afterData ? JSON.stringify(payload.afterData) : null,
    ],
  );
};

export const getSkpDocuments = async (req: Request, res: Response) => {
  try {
    await ensureSkpTable();
    await ensureSkpSoftDeleteColumns();

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
      clauses.push("(LOWER(nama_skp) LIKE ? OR LOWER(uploaded_by) LIKE ?)");
      values.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    const user = (req as AuthenticatedRequest).user;
    const isAdmin = user?.role === "Admin" || user?.role === "Admin Akuntansi";
    const uploaderName = user?.username || user?.role || "-";

    if (!isAdmin) {
      clauses.push("uploaded_by = ?");
      values.push(uploaderName);
    }

    clauses.push("is_deleted = 0");
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
  let connection: PoolConnection | null = null;
  try {
    await ensureSkpTable();
    await ensureSkpSoftDeleteColumns();

    const { nama_skp, triwulan, tahun, target_user } = req.body as {
      nama_skp?: string;
      triwulan?: string | number;
      tahun?: string | number;
      target_user?: string;
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

    if (trimmedNamaSkp.length < 3 || trimmedNamaSkp.length > 255) {
      return res.status(400).json({ message: "Nama SKP harus 3-255 karakter." });
    }

    if (![1, 2, 3, 4].includes(parsedTriwulan)) {
      return res.status(400).json({ message: "Triwulan harus antara 1 sampai 4." });
    }

    const maxAllowedYear = new Date().getFullYear() + 1;
    if (Number.isNaN(parsedTahun) || parsedTahun < 2000 || parsedTahun > maxAllowedYear) {
      return res.status(400).json({ message: "Tahun tidak valid." });
    }

    const user = (req as AuthenticatedRequest).user;
    const isAdmin = user?.role === "Admin" || user?.role === "Admin Akuntansi";
    let uploaderName = user?.username || user?.role || "-";
    
    if (isAdmin && target_user && target_user.trim().length > 0) {
      uploaderName = target_user.trim();
    }

    const filePath = `uploads/${req.file.filename}`;
    const [duplicateRows]: any = await db.execute(
      `SELECT id FROM skp_documents
       WHERE uploaded_by = ? AND tahun = ? AND triwulan = ? AND nama_skp = ? AND is_deleted = 0
       LIMIT 1`,
      [uploaderName, parsedTahun, parsedTriwulan, trimmedNamaSkp],
    );
    if (duplicateRows.length > 0) {
      cleanupUploadedFile(filePath);
      return res.status(409).json({
        message: "Dokumen SKP dengan nama, triwulan, dan tahun yang sama sudah ada untuk staff ini.",
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO skp_documents (nama_skp, triwulan, tahun, file_path, uploaded_by)
       VALUES (?, ?, ?, ?, ?)`,
      [trimmedNamaSkp, parsedTriwulan, parsedTahun, filePath, uploaderName],
    );

    await writeSkpHistory(connection, {
      skpDocumentId: (result as any)?.insertId ?? null,
      actionType: "upload",
      actorUsername: (req as AuthenticatedRequest).user?.username || null,
      actorRole: (req as AuthenticatedRequest).user?.role || null,
      targetUploadedBy: uploaderName,
      beforeData: null,
      afterData: {
        nama_skp: trimmedNamaSkp,
        triwulan: parsedTriwulan,
        tahun: parsedTahun,
        file_path: filePath,
      },
    });
    await connection.commit();
    connection.release();
    connection = null;

    return res.status(201).json({
      message: "Dokumen SKP berhasil diunggah.",
      data: {
        id: (result as any)?.insertId,
      },
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
        connection.release();
      } catch {}
      connection = null;
    }
    if (req.file?.filename) {
      cleanupUploadedFile(`uploads/${req.file.filename}`);
    }
    console.error("Create SKP document error:", error);
    return res.status(500).json({ message: "Gagal mengunggah dokumen SKP" });
  }
};

const cleanupUploadedFile = (filePath?: string | null) => {
  if (!filePath) return;
  const normalized = filePath.replace(/\\/g, "/").replace(/^\/+/, "");
  const relative = normalized.replace(/^uploads\//i, "");
  const backendPath = path.resolve(BACKEND_UPLOADS_DIR, relative);
  const rootPath = path.resolve(ROOT_UPLOADS_DIR, relative);
  try {
    if (fs.existsSync(backendPath)) fs.unlinkSync(backendPath);
    if (fs.existsSync(rootPath)) fs.unlinkSync(rootPath);
  } catch (error) {
    console.error("Cleanup SKP file error:", error);
  }
};

export const updateSkpDocument = async (req: Request, res: Response) => {
  let connection: PoolConnection | null = null;
  try {
    await ensureSkpTable();
    await ensureSkpSoftDeleteColumns();
    const { id } = req.params;
    const { nama_skp, triwulan, tahun, target_user } = req.body as {
      nama_skp?: string;
      triwulan?: string | number;
      tahun?: string | number;
      target_user?: string;
    };

    const parsedTriwulan = Number(triwulan);
    const parsedTahun = Number(tahun);
    const trimmedNamaSkp = String(nama_skp || "").trim();
    if (trimmedNamaSkp.length < 3 || trimmedNamaSkp.length > 255 || ![1, 2, 3, 4].includes(parsedTriwulan)) {
      return res.status(400).json({ message: "Data SKP tidak valid." });
    }
    const maxAllowedYear = new Date().getFullYear() + 1;
    if (Number.isNaN(parsedTahun) || parsedTahun < 2000 || parsedTahun > maxAllowedYear) {
      return res.status(400).json({ message: "Tahun tidak valid." });
    }

    const [rows]: any = await db.execute(
      "SELECT id, nama_skp, triwulan, tahun, file_path, uploaded_by FROM skp_documents WHERE id = ? AND is_deleted = 0 LIMIT 1",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Dokumen SKP tidak ditemukan." });
    }

    let nextFilePath: string = rows[0].file_path;
    const hadNewUpload = Boolean(req.file?.filename);
    if (hadNewUpload) {
      nextFilePath = `uploads/${req.file!.filename}`;
    }

    const [duplicateRows]: any = await db.execute(
      `SELECT id FROM skp_documents
       WHERE uploaded_by = ? AND tahun = ? AND triwulan = ? AND nama_skp = ? AND id <> ? AND is_deleted = 0
       LIMIT 1`,
      [rows[0].uploaded_by || "-", parsedTahun, parsedTriwulan, trimmedNamaSkp, id],
    );
    if (duplicateRows.length > 0) {
      if (req.file?.filename) cleanupUploadedFile(`uploads/${req.file.filename}`);
      return res.status(409).json({
        message: "Dokumen SKP duplikat terdeteksi untuk staff/triwulan/tahun yang sama.",
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    await connection.execute(
      `UPDATE skp_documents
       SET nama_skp = ?, triwulan = ?, tahun = ?, file_path = ?
       WHERE id = ?`,
      [trimmedNamaSkp, parsedTriwulan, parsedTahun, nextFilePath, id],
    );

    await writeSkpHistory(connection, {
      skpDocumentId: Number(id),
      actionType: "edit",
      actorUsername: (req as AuthenticatedRequest).user?.username || null,
      actorRole: (req as AuthenticatedRequest).user?.role || null,
      targetUploadedBy: rows[0].uploaded_by || null,
      beforeData: {
        nama_skp: rows[0].nama_skp,
        triwulan: rows[0].triwulan,
        tahun: rows[0].tahun,
        file_path: rows[0].file_path,
      },
      afterData: {
        nama_skp: trimmedNamaSkp,
        triwulan: parsedTriwulan,
        tahun: parsedTahun,
        file_path: nextFilePath,
      },
    });
    await connection.commit();
    connection.release();
    connection = null;

    if (hadNewUpload && rows[0].file_path) {
      cleanupUploadedFile(rows[0].file_path);
    }

    return res.status(200).json({ message: "Dokumen SKP berhasil diperbarui." });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
        connection.release();
      } catch {}
      connection = null;
    }
    if (req.file?.filename) {
      cleanupUploadedFile(`uploads/${req.file.filename}`);
    }
    console.error("Update SKP document error:", error);
    return res.status(500).json({ message: "Gagal memperbarui dokumen SKP" });
  }
};

export const deleteSkpDocument = async (req: Request, res: Response) => {
  let connection: PoolConnection | null = null;
  try {
    await ensureSkpTable();
    await ensureSkpSoftDeleteColumns();
    const { id } = req.params;
    const [rows]: any = await db.execute(
      "SELECT id, nama_skp, triwulan, tahun, file_path, uploaded_by FROM skp_documents WHERE id = ? AND is_deleted = 0 LIMIT 1",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Dokumen SKP tidak ditemukan." });
    }
    connection = await db.getConnection();
    await connection.beginTransaction();
    await connection.execute("UPDATE skp_documents SET is_deleted = 1, deleted_at = NOW() WHERE id = ? AND is_deleted = 0", [id]);

    await writeSkpHistory(connection, {
      skpDocumentId: Number(id),
      actionType: "delete",
      actorUsername: (req as AuthenticatedRequest).user?.username || null,
      actorRole: (req as AuthenticatedRequest).user?.role || null,
      targetUploadedBy: rows[0].uploaded_by || null,
      beforeData: {
        nama_skp: rows[0].nama_skp,
        triwulan: rows[0].triwulan,
        tahun: rows[0].tahun,
        file_path: rows[0].file_path,
      },
      afterData: null,
    });
    await connection.commit();
    connection.release();
    connection = null;
    // cleanupUploadedFile(rows[0].file_path);

    return res.status(200).json({ message: "Dokumen SKP berhasil dihapus." });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
        connection.release();
      } catch {}
      connection = null;
    }
    console.error("Delete SKP document error:", error);
    return res.status(500).json({ message: "Gagal menghapus dokumen SKP" });
  }
};

export const getSkpHistories = async (req: Request, res: Response) => {
  try {
    await ensureSkpHistoryTable();
    const action = String(req.query.action || "all").trim().toLowerCase();
    const staff = String(req.query.staff || "").trim().toLowerCase();
    const search = String(req.query.search || "").trim().toLowerCase();
    const startDate = String(req.query.startDate || "").trim();
    const endDate = String(req.query.endDate || "").trim();

    const user = (req as AuthenticatedRequest).user;
    const isAdmin = user?.role === "Admin" || user?.role === "Admin Akuntansi";
    const uploaderName = user?.username || user?.role || "-";

    const where: string[] = [];
    const values: Array<string> = [];

    if (!isAdmin) {
      where.push("target_uploaded_by = ?");
      values.push(uploaderName);
    }

    if (action && action !== "all") {
      where.push("action_type = ?");
      values.push(action);
    }
    if (staff) {
      where.push("LOWER(target_uploaded_by) LIKE ?");
      values.push(`%${staff}%`);
    }
    if (search) {
      where.push(
        "(LOWER(actor_username) LIKE ? OR LOWER(target_uploaded_by) LIKE ? OR LOWER(action_type) LIKE ?)",
      );
      values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (startDate) {
      where.push("DATE(created_at) >= ?");
      values.push(startDate);
    }
    if (endDate) {
      where.push("DATE(created_at) <= ?");
      values.push(endDate);
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";

    const [rows] = await db.query(
      `SELECT id, skp_document_id, action_type, actor_username, actor_role, target_uploaded_by, before_data, after_data, created_at
       FROM skp_history
       ${whereSql}
       ORDER BY created_at DESC, id DESC`,
      values,
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Get SKP history error:", error);
    return res.status(500).json({ message: "Gagal mengambil riwayat SKP" });
  }
};

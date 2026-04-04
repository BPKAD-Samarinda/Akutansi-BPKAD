import { Request, Response } from "express";
import db from "../config/db";
import fs from "fs";
import path from "path";
import { BACKEND_UPLOADS_DIR, ROOT_UPLOADS_DIR } from "../config/uploadPaths";

const allowedDefinitions: { [key: string]: string } = {
  is_deleted: "is_deleted TINYINT(1) NOT NULL DEFAULT 0",
  deleted_at: "deleted_at DATETIME NULL",
  uploaded_by: "uploaded_by VARCHAR(255) NULL",
};

const ensureColumnExists = async (
  columnName: keyof typeof allowedDefinitions,
) => {
  const definition = allowedDefinitions[columnName];
  if (!definition) {
    console.error(
      `Invalid column specified for ensureColumnExists: ${String(columnName)}`,
    );
    return;
  }

  const [rows] = await db.query(
    `SELECT 1
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'documents'
       AND COLUMN_NAME = ?
     LIMIT 1`,
    [columnName],
  );

  if ((rows as Record<string, unknown>[]).length === 0) {
    await db.execute(`ALTER TABLE documents ADD COLUMN ${definition}`);
  }
};

const ensureSoftDeleteColumns = async () => {
  await ensureColumnExists("is_deleted");
  await ensureColumnExists("deleted_at");
  await ensureColumnExists("uploaded_by");
};

const ensureDocumentHistoryTable = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS document_history (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      document_id BIGINT NULL,
      document_name VARCHAR(255) NOT NULL,
      uploaded_by VARCHAR(255) NULL,
      status VARCHAR(20) NOT NULL,
      file_path VARCHAR(255) NULL,
      file_size VARCHAR(50) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_document_history_created_at (created_at),
      INDEX idx_document_history_status (status)
    )
  `);
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes || Number.isNaN(bytes)) return "-";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
};

const getDocumentName = (row: Record<string, any>): string => {
  return (
    row.nama_sppd ||
    row.no_sppd ||
    row.nama_kegiatan ||
    row.document_name ||
    `Dokumen #${row.id}`
  );
};

const toHistoryItem = (row: Record<string, any>) => ({
  id: row.id,
  document_name: getDocumentName(row),
  uploaded_at: row.created_at || row.tanggal_sppd || row.deleted_at || null,
  uploaded_by: row.uploaded_by || row.uploader_name || "-",
  file_size: row.file_size || row.size_label || "-",
  file_path: row.file_path || "",
});

export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    await ensureSoftDeleteColumns();
    const [rows] = await db.query(
      "SELECT * FROM documents WHERE is_deleted = 0 ORDER BY created_at DESC",
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    await ensureSoftDeleteColumns();
    await ensureDocumentHistoryTable();

    const { nama_sppd, tanggal_sppd, kategori } = req.body;
    const uploaderName =
      (req as any)?.user?.username || (req as any)?.user?.role || null;

    if ((req as any).fileValidationError) {
      return res.status(400).json({ message: (req as any).fileValidationError });
    }

    if (!req.file) {
      return res.status(400).json({
        message:
          "File upload failed. Please check if the file is a valid type (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, PNG, JPG) and under 20MB.",
      });
    }

    const file_path = `uploads/${req.file.filename}`;

    if (!nama_sppd || !tanggal_sppd || !kategori) {
      return res.status(400).json({ message: "All text fields are required" });
    }

    const [duplicateRows]: any = await db.execute(
      "SELECT id FROM documents WHERE nama_sppd = ? AND tanggal_sppd = ? AND is_deleted = 0 LIMIT 1",
      [nama_sppd, tanggal_sppd],
    );

    if (duplicateRows.length > 0) {
      return res.status(409).json({
        message: "Dokumen dengan nama dan tanggal yang sama sudah ada.",
      });
    }

    const [result] = await db.execute(
      "INSERT INTO documents (nama_sppd, tanggal_sppd, kategori, file_path, uploaded_by) VALUES (?, ?, ?, ?, ?)",
      [nama_sppd, tanggal_sppd, kategori, file_path, uploaderName],
    );

    await db.execute(
      `INSERT INTO document_history (document_id, document_name, uploaded_by, status, file_path, file_size)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        (result as any).insertId ?? null,
        nama_sppd,
        uploaderName,
        "diunggah",
        file_path,
        formatFileSize(req.file?.size),
      ],
    );

    res
      .status(201)
      .json({ message: "Document created successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    await ensureSoftDeleteColumns();
    await ensureDocumentHistoryTable();
    const { id } = req.params;
    const { nama_sppd, tanggal_sppd, kategori } = req.body;
    const uploaderName =
      (req as any)?.user?.username || (req as any)?.user?.role || null;

    if ((req as any).fileValidationError) {
      return res.status(400).json({ message: (req as any).fileValidationError });
    }

    if (!nama_sppd || !tanggal_sppd || !kategori) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let newFilePath: string | null = null;
    let existingFilePath = "";
    if (req.file) {
      newFilePath = `uploads/${req.file.filename}`;
      const [rows]: any = await db.execute(
        "SELECT file_path FROM documents WHERE id = ? AND is_deleted = 0",
        [id],
      );
      existingFilePath = rows?.[0]?.file_path ? String(rows[0].file_path) : "";
      if (existingFilePath) {
        const normalized = existingFilePath.replace(/\\/g, "/").replace(/^\/+/, "");
        const relative = normalized.replace(/^uploads\//i, "");
        const backendPath = path.resolve(BACKEND_UPLOADS_DIR, relative);
        const rootPath = path.resolve(ROOT_UPLOADS_DIR, relative);
        if (fs.existsSync(backendPath)) {
          fs.unlinkSync(backendPath);
        } else if (fs.existsSync(rootPath)) {
          fs.unlinkSync(rootPath);
        }
      }
    }

    const [result] = await db.execute(
      "UPDATE documents SET nama_sppd = ?, tanggal_sppd = ?, kategori = ?, file_path = COALESCE(?, file_path) WHERE id = ? AND is_deleted = 0",
      [nama_sppd, tanggal_sppd, kategori, newFilePath, id],
    );

    const finalFilePath = newFilePath || existingFilePath;
    await db.execute(
      `INSERT INTO document_history (document_id, document_name, uploaded_by, status, file_path, file_size)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        nama_sppd,
        uploaderName,
        "diedit",
        finalFilePath || null,
        formatFileSize(req.file?.size),
      ],
    );

    res
      .status(200)
      .json({ message: "Document updated successfully", data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    await ensureSoftDeleteColumns();
    await ensureDocumentHistoryTable();
    const { id } = req.params;

    const [existingRows]: any = await db.execute(
      "SELECT id, is_deleted, nama_sppd, uploaded_by, file_path FROM documents WHERE id = ?",
      [id],
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (existingRows[0].is_deleted === 1) {
      return res.status(200).json({ message: "Document already deleted" });
    }

    await db.execute(
      `INSERT INTO document_history (document_id, document_name, uploaded_by, status, file_path, file_size)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        existingRows[0].nama_sppd || `Dokumen #${id}`,
        existingRows[0].uploaded_by || null,
        "dihapus",
        existingRows[0].file_path || null,
        "-",
      ],
    );

    await db.execute(
      "UPDATE documents SET is_deleted = 1, deleted_at = NOW() WHERE id = ?",
      [id],
    );

    res.status(200).json({ message: "Document moved to upload history" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUploadHistory = async (req: Request, res: Response) => {
  try {
    await ensureSoftDeleteColumns();
    await ensureDocumentHistoryTable();

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const search = String(req.query.search || "")
      .trim()
      .toLowerCase();
    const status = String(req.query.status || "all").toLowerCase();

    const [rows] = await db.query(
      `SELECT id, document_id, document_name, uploaded_by, status, file_path, file_size, created_at
       FROM document_history
       ORDER BY created_at DESC, id DESC`,
    );

    const mappedItems = (rows as Record<string, any>[]).map((row) => ({
      id: row.id,
      document_name: row.document_name,
      uploaded_at: row.created_at,
      uploaded_by: row.uploaded_by || "-",
      file_size: row.file_size || "-",
      file_path: row.file_path || "",
      status: row.status || "diunggah",
      isDeleted: String(row.status || "").toLowerCase() === "dihapus",
    }));

    const statusFiltered =
      status === "all"
        ? mappedItems
        : mappedItems.filter(
            (item) => String(item.status || "").toLowerCase() === status,
          );

    const filteredItems =
      search.length === 0
        ? statusFiltered
        : statusFiltered.filter((item) =>
            String(item.document_name || "").toLowerCase().includes(search),
          );

    const total = filteredItems.length;
    const start = (page - 1) * limit;
    const items = filteredItems.slice(start, start + limit);

    return res.status(200).json({
      items,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const restoreDocumentFromHistory = async (
  req: Request,
  res: Response,
) => {
  try {
    await ensureSoftDeleteColumns();

    const { id } = req.params;
    const [rows]: any = await db.execute(
      "SELECT id, is_deleted FROM documents WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (rows[0].is_deleted !== 1) {
      return res.status(400).json({ message: "Document is not in history" });
    }

    await db.execute(
      "UPDATE documents SET is_deleted = 0, deleted_at = NULL WHERE id = ?",
      [id],
    );

    return res.status(200).json({ message: "Document restored successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const permanentlyDeleteDocumentFromHistory = async (
  req: Request,
  res: Response,
) => {
  try {
    await ensureSoftDeleteColumns();

    const { id } = req.params;
    const [rows]: any = await db.execute(
      "SELECT id, is_deleted, file_path FROM documents WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (rows[0].is_deleted !== 1) {
      return res
        .status(400)
        .json({ message: "Document must be in history before permanent delete" });
    }

    const filePath = String(rows[0].file_path || "");
    const fileName = path.basename(filePath.replace(/\\/g, "/"));

    if (fileName) {
      const possiblePaths = [
        path.join(BACKEND_UPLOADS_DIR, fileName),
        path.join(ROOT_UPLOADS_DIR, fileName),
      ];

      await Promise.all(
        possiblePaths.map(async (absolutePath) => {
          try {
            await fs.promises.unlink(absolutePath);
          } catch (error: any) {
            if (error?.code !== "ENOENT") {
              console.error("Failed deleting file:", absolutePath, error);
            }
          }
        }),
      );
    }

    await db.execute("DELETE FROM documents WHERE id = ? AND is_deleted = 1", [
      id,
    ]);

    return res
      .status(200)
      .json({ message: "Document permanently deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

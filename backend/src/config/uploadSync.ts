import fs from "fs";
import path from "path";
import db from "./db";
import { BACKEND_UPLOADS_DIR, ROOT_UPLOADS_DIR } from "./uploadPaths";

const ALLOWED_EXTENSIONS = new Set([
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
]);

const normalizeStoredPath = (filePath: string) => {
  const normalized = String(filePath || "").replace(/\\/g, "/").trim();
  const relative = normalized.replace(/^\/?uploads\/?/i, "");
  return `uploads/${relative}`;
};

const resolvePhysicalPath = (storedPath: string) => {
  const relative = normalizeStoredPath(storedPath).replace(/^uploads\//i, "");
  const backendFile = path.resolve(BACKEND_UPLOADS_DIR, relative);
  if (fs.existsSync(backendFile)) {
    return backendFile;
  }

  const rootFile = path.resolve(ROOT_UPLOADS_DIR, relative);
  if (fs.existsSync(rootFile)) {
    return rootFile;
  }

  return null;
};

const titleFromFilename = (filename: string) => {
  return path
    .parse(filename)
    .name.replace(/^file-\d+-\d+/i, "Dokumen")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const guessCategory = (filename: string) => {
  const upper = filename.toUpperCase();
  if (upper.includes("REKENING") && upper.includes("KORAN")) return "Rekening Koran";
  if (upper.includes("STS")) return "STS";
  if (upper.includes("BKU")) return "BKU";
  if (upper.includes("KEUANGAN")) return "Keuangan";
  return "Lampiran";
};

const formatDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

let syncPromise: Promise<void> | null = null;

export const syncUploadsToDatabase = async () => {
  if (syncPromise) {
    return syncPromise;
  }

  syncPromise = (async () => {
    try {
      const [columns]: any = await db.query("SHOW COLUMNS FROM documents");
      const columnNames = new Set(columns.map((col: any) => col.Field));

      if (!columnNames.has("is_deleted")) {
        await db.execute(
          "ALTER TABLE documents ADD COLUMN is_deleted TINYINT(1) NOT NULL DEFAULT 0",
        );
      }
      if (!columnNames.has("deleted_at")) {
        await db.execute(
          "ALTER TABLE documents ADD COLUMN deleted_at DATETIME NULL",
        );
      }
      if (!columnNames.has("uploaded_by")) {
        await db.execute(
          "ALTER TABLE documents ADD COLUMN uploaded_by VARCHAR(255) NULL",
        );
      }
      await db.execute(`
        CREATE TABLE IF NOT EXISTS document_history (
          id BIGINT AUTO_INCREMENT PRIMARY KEY,
          document_id BIGINT NULL,
          document_name VARCHAR(255) NOT NULL,
          uploaded_by VARCHAR(255) NULL,
          status VARCHAR(20) NOT NULL,
          file_path VARCHAR(255) NULL,
          file_size VARCHAR(50) NULL,
          edit_before TEXT NULL,
          edit_after TEXT NULL,
          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_document_history_created_at (created_at),
          INDEX idx_document_history_status (status)
        )
      `);

      // Get all SKP document filenames to exclude them from documents sync
      const skpFilenames = new Set<string>();
      try {
        const [skpRows]: any = await db.query("SELECT file_path FROM skp_documents");
        for (const row of skpRows) {
          if (row.file_path) {
            const filename = path.basename(row.file_path);
            if (filename) {
              skpFilenames.add(filename.toLowerCase());
            }
          }
        }
      } catch (err) {
        // If skp_documents table doesn't exist yet, we just ignore it
        console.log("skp_documents table not queried (might not exist yet):", err);
      }

      const [rows] = await db.query(
        "SELECT id, nama_sppd, tanggal_sppd, kategori, file_path, uploaded_by, is_deleted FROM documents",
      );
      const documents = rows as Array<{
        id: number;
        nama_sppd: string;
        tanggal_sppd: string;
        kategori: string;
        file_path: string;
        uploaded_by: string | null;
        is_deleted: number;
      }>;

      const knownPaths = new Set<string>();

      for (const doc of documents) {
        const storedPath = normalizeStoredPath(doc.file_path);
        const docFilename = path.basename(storedPath).toLowerCase();

        // If this document is actually an SKP document, soft-delete it from documents table
        if (skpFilenames.has(docFilename)) {
          if (doc.is_deleted === 0) {
            await db.execute(
              "UPDATE documents SET is_deleted = 1, deleted_at = NOW() WHERE id = ?",
              [doc.id],
            );
          }
          continue;
        }

        const exists = resolvePhysicalPath(storedPath);

        if (!exists && doc.is_deleted === 0) {
          await db.execute(
            "UPDATE documents SET is_deleted = 1, deleted_at = NOW() WHERE id = ?",
            [doc.id],
          );
          continue;
        }

        knownPaths.add(storedPath);
      }

      if (!fs.existsSync(BACKEND_UPLOADS_DIR)) {
        return;
      }

      const files = fs
        .readdirSync(BACKEND_UPLOADS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((name) => ALLOWED_EXTENSIONS.has(path.extname(name).toLowerCase()))
        .filter((name) => !skpFilenames.has(name.toLowerCase()));

      for (const filename of files) {
        const storedPath = `uploads/${filename}`;
        if (knownPaths.has(storedPath)) {
          continue;
        }

        const fullPath = path.resolve(BACKEND_UPLOADS_DIR, filename);
        const stats = fs.statSync(fullPath);
        
        // Skip files that were created or modified within the last 30 seconds to prevent race conditions during upload
        const ageInSeconds = (Date.now() - stats.mtimeMs) / 1000;
        if (ageInSeconds < 30) {
          console.log(`Skipping sync for very new file to prevent race conditions: ${filename}`);
          continue;
        }

        const tanggal = formatDateOnly(stats.mtime);
        const namaDokumen = titleFromFilename(filename) || filename;
        const kategori = guessCategory(filename);

        const [insertResult]: any = await db.execute(
          `INSERT INTO documents (nama_sppd, tanggal_sppd, kategori, file_path, uploaded_by, is_deleted)
           VALUES (?, ?, ?, ?, ?, 0)`,
          [namaDokumen, tanggal, kategori, storedPath, "system"],
        );

        await db.execute(
          `INSERT INTO document_history (document_id, document_name, uploaded_by, status, file_path, file_size)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            insertResult.insertId ?? null,
            namaDokumen,
            "system",
            "diunggah",
            storedPath,
            `${(stats.size / 1024).toFixed(1)} KB`,
          ],
        );
      }
    } catch (error) {
      console.error("Upload sync error:", error);
    } finally {
      syncPromise = null;
    }
  })();

  return syncPromise;
};

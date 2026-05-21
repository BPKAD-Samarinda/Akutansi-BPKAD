import { Request, Response } from "express";
import db from "../config/db";
import { syncUploadsToDatabase } from "../config/uploadSync";

type AuthenticatedRequest = Request & {
  user?: {
    username?: string;
    role: string;
  };
};

const ensureSoftDeleteColumns = async () => {
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
};

const ensureLoginActivitiesTable = async () => {
  await db.execute(`
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

const ensureSkpDocumentsTable = async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS skp_documents (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      nama_skp VARCHAR(255) NOT NULL,
      triwulan TINYINT NOT NULL,
      tahun INT NOT NULL,
      file_path VARCHAR(255) NOT NULL,
      uploaded_by VARCHAR(255) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

export const getDashboardAnalytics = async (req: Request, res: Response) => {
  try {
    await syncUploadsToDatabase();
    await ensureSoftDeleteColumns();
    await ensureSkpDocumentsTable();

    const [documentRows] = await db.query(
      `SELECT id, nama_sppd, kategori, tanggal_sppd, created_at, uploaded_by
       FROM documents
       WHERE is_deleted = 0
       ORDER BY created_at DESC, id DESC`,
    );

    const currentUser = (req as AuthenticatedRequest).user;
    const isAdminRole =
      currentUser?.role === "Admin" || currentUser?.role === "Admin Akuntansi";
    const uploaderName = currentUser?.username || currentUser?.role || "-";

    let skpQuery = `SELECT id, nama_skp, triwulan, tahun, created_at, uploaded_by
       FROM skp_documents
       WHERE is_deleted = 0
       ORDER BY created_at DESC, id DESC`;
    let skpParams: any[] = [];

    if (!isAdminRole) {
      skpQuery = `SELECT id, nama_skp, triwulan, tahun, created_at, uploaded_by
       FROM skp_documents
       WHERE uploaded_by = ? AND is_deleted = 0
       ORDER BY created_at DESC, id DESC`;
      skpParams = [uploaderName];
    }

    const [skpRows] = await db.query(skpQuery, skpParams);

    let loginRows: unknown[] = [];
    if (isAdminRole) {
      try {
        await ensureLoginActivitiesTable();
        const [rows] = await db.query(
          `SELECT id, username, role, login_at
           FROM login_activities
           ORDER BY login_at DESC, id DESC
           LIMIT 1000`,
        );
        loginRows = rows as unknown[];
      } catch (loginError) {
        // Tetap kirim data dokumen walau tabel login belum bisa diakses/dibuat.
        console.warn("Dashboard login activity fallback:", loginError);
      }
    }

    const [userRows]: any = await db.query(
      "SELECT COUNT(id) as total FROM users",
    );

    const totalUsers = userRows[0]?.total || 0;

    return res.status(200).json({
      documents: documentRows,
      skpDocuments: skpRows,
      loginActivities: loginRows,
      totalUsers,
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


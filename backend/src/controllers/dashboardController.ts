import { Request, Response } from "express";
import db from "../config/db";

const ensureSoftDeleteColumns = async () => {
  await db.execute(
    "ALTER TABLE documents ADD COLUMN IF NOT EXISTS is_deleted TINYINT(1) NOT NULL DEFAULT 0",
  );
  await db.execute(
    "ALTER TABLE documents ADD COLUMN IF NOT EXISTS deleted_at DATETIME NULL",
  );
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

export const getDashboardAnalytics = async (_req: Request, res: Response) => {
  try {
    await ensureSoftDeleteColumns();

    const [documentRows] = await db.query(
      `SELECT id, nama_sppd, kategori, tanggal_sppd, created_at
       FROM documents
       WHERE is_deleted = 0
       ORDER BY created_at DESC, id DESC`,
    );

    let loginRows: unknown[] = [];
    let totalStaffUsers = 0;
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

    try {
      const [staffRows]: any = await db.query(
        `SELECT COUNT(*) AS total
         FROM users
         WHERE LOWER(role) = 'staff'`,
      );
      totalStaffUsers = Number(staffRows?.[0]?.total ?? 0);
    } catch (staffError) {
      console.warn("Dashboard staff count fallback:", staffError);
    }

    return res.status(200).json({
      documents: documentRows,
      loginActivities: loginRows,
      totalStaffUsers,
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

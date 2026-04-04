import db from "./db";

export const normalizeUserRoles = async () => {
  try {
    const [rows] = await db.query(
      `SELECT 1
       FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'users'
       LIMIT 1`,
    );
    if ((rows as Record<string, unknown>[]).length === 0) {
      return;
    }
    await db.execute(
      "UPDATE users SET role = 'Admin' WHERE role = 'Admin Akuntansi'",
    );
    await db.execute(
      "UPDATE users SET role = 'Staff' WHERE role = 'Staff Akuntansi'",
    );
  } catch (error) {
    console.error("Normalize roles error:", error);
  }
};

import db from "./db";

export const normalizeUserRoles = async () => {
  try {
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

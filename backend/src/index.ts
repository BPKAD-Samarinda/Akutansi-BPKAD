import type { Request, Response } from "express";
import "./config/db";
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import documentRoutes from "./routes/documentRoutes";
import userRoutes from "./routes/userRoutes";
import skpRoutes from "./routes/skpRoutes";
import { normalizeUserRoles } from "./config/roleNormalization";
import { BACKEND_UPLOADS_DIR, ROOT_UPLOADS_DIR, BACKEND_SKP_DIR, ROOT_SKP_DIR } from "./config/uploadPaths";
import { syncUploadsToDatabase } from "./config/uploadSync";
import { getJwtSecret } from "./config/jwt";

const app = express();
const port = process.env.PORT || 3001;

// Fail fast on startup if JWT secret is missing.
getJwtSecret();
normalizeUserRoles();
syncUploadsToDatabase().catch((error) => {
  console.error("Initial upload sync failed:", error);
});

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(BACKEND_UPLOADS_DIR));
app.use("/uploads", express.static(ROOT_UPLOADS_DIR));
app.use("/uploads/skp", express.static(BACKEND_SKP_DIR));
app.use("/uploads/skp", express.static(ROOT_SKP_DIR));

app.use("/api/auth", authRoutes);
app.use("/api", documentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skp", skpRoutes);

app.listen(port, () => {
  console.log(`[server]: Server backend berjalan di http://localhost:${port}`);
});

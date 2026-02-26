import type { Request, Response } from "express";
import "./config/db";
import express from "express";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/authRoutes";
import documentRoutes from "./routes/documentRoutes";
import { BACKEND_UPLOADS_DIR, ROOT_UPLOADS_DIR } from "./config/uploadPaths";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(BACKEND_UPLOADS_DIR));
app.use("/uploads", express.static(ROOT_UPLOADS_DIR));

app.use("/api/auth", authRoutes);
app.use("/api", documentRoutes);

app.listen(port, () => {
  console.log(`[server]: Server backend berjalan di http://localhost:${port}`);
});

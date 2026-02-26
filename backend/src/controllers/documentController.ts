import { Request, Response } from "express";
import db from "../config/db";
import fs from "fs";
import path from "path";
import { BACKEND_UPLOADS_DIR, ROOT_UPLOADS_DIR } from "../config/uploadPaths";

export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM documents");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { nama_sppd, tanggal_sppd, kategori } = req.body;
    const file_path = req.file ? `uploads/${req.file.filename}` : null;

    if (!nama_sppd || !tanggal_sppd || !kategori || !file_path) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [result] = await db.execute(
      "INSERT INTO documents (nama_sppd, tanggal_sppd, kategori, file_path) VALUES (?, ?, ?, ?)",
      [nama_sppd, tanggal_sppd, kategori, file_path],
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
    const { id } = req.params;
    const { nama_sppd, tanggal_sppd, kategori, total_biaya } = req.body;

    if (!nama_sppd || !tanggal_sppd || !kategori || !total_biaya) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [result] = await db.execute(
      "UPDATE documents SET nama_sppd = ?, tanggal_sppd = ?, kategori = ?, total_biaya = ? WHERE id = ?",
      [nama_sppd, tanggal_sppd, kategori, total_biaya, id],
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
    const { id } = req.params;

    // 1️⃣ Ambil dulu file_path dari database
    const [rows]: any = await db.execute(
      "SELECT file_path FROM documents WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = rows[0].file_path;

    // 2️⃣ Hapus file dari folder uploads
    if (filePath) {
      const normalizedPath = String(filePath).replace(/\\/g, "/");
      const fileName = path.basename(normalizedPath);

      const candidatePaths = [
        path.join(BACKEND_UPLOADS_DIR, fileName),
        path.join(ROOT_UPLOADS_DIR, fileName),
      ];

      for (const fullPath of candidatePaths) {
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          break;
        }
      }
    }

    // 3️⃣ Hapus dari database
    await db.execute("DELETE FROM documents WHERE id = ?", [id]);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

import { Router } from "express";
import {
  getAllDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/documentController";
import multer from "multer";
import path from "path";
import fs from "fs";
import { BACKEND_UPLOADS_DIR } from "../config/uploadPaths";

const router = Router();

// nyetting multer buat penyimpanan filenya
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(BACKEND_UPLOADS_DIR, { recursive: true });
    cb(null, BACKEND_UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    // buat nama file unik buat menghindari konflik/mempertahankan ekstensi asli
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

// route untuk dokumen
router.get("/documents", getAllDocuments);
router.post("/documents", upload.single("file"), createDocument); // taro middleware multer di sini
router.put("/documents/:id", updateDocument);
router.delete("/documents/:id", deleteDocument);

export default router;

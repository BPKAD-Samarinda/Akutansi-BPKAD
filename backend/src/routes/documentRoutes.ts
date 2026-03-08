import { Router } from "express";
import {
  getAllDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  getUploadHistory,
  restoreDocumentFromHistory,
} from "../controllers/documentController";
import { getDashboardAnalytics } from "../controllers/dashboardController";
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

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (req: any, file: any, cb: any) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// route untuk dokumen
router.get("/documents", getAllDocuments);
router.get("/dashboard/analytics", getDashboardAnalytics);
router.get("/documents/history", getUploadHistory);
router.post("/documents", upload.single("file"), createDocument); // taro middleware multer di sini
router.put("/documents/:id", updateDocument);
router.delete("/documents/:id", deleteDocument);
router.post("/documents/history/:id/restore", restoreDocumentFromHistory);

export default router;

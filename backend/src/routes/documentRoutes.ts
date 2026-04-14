import { Router } from "express";
import {
  getAllDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  getUploadHistory,
  restoreDocumentFromHistory,
  permanentlyDeleteDocumentFromHistory,
} from "../controllers/documentController";
import { getDashboardAnalytics } from "../controllers/dashboardController";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware";
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
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/jfif",
  "image/png",
  "image/heic",
  "image/heif",
];

const fileFilter = (req: any, file: any, cb: any) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    req.fileValidationError = "Tipe file tidak didukung.";
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB
  },
});

const uploadSingle = (req: any, res: any, next: any) => {
  upload.single("file")(req, res, (err: any) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "Ukuran file terlalu besar. Maksimal ukuran file adalah 30MB.",
        });
      }
      return res.status(400).json({
        message: "Upload gagal. Pastikan format file didukung.",
      });
    }
    if (req.fileValidationError) {
      return res.status(400).json({ message: req.fileValidationError });
    }
    next();
  });
};

// route untuk dokumen
router.get("/documents", authenticateToken, getAllDocuments);
router.get(
  "/dashboard/analytics",
  authenticateToken,
  authorizeRoles(
    "Admin",
    "Staff",
    "Anak Magang",
    "Anak PKL",
    "Admin Akuntansi",
    "Staff Akuntansi",
  ),
  getDashboardAnalytics,
);
router.get("/documents/history", authenticateToken, getUploadHistory);
router.post(
  "/documents",
  authenticateToken,
  authorizeRoles(
    "Admin",
    "Staff",
    "Anak Magang",
    "Anak PKL",
    "Admin Akuntansi",
    "Staff Akuntansi",
  ),
  uploadSingle,
  createDocument,
); // taro middleware multer di sini
router.put(
  "/documents/:id",
  authenticateToken,
  authorizeRoles("Admin", "Admin Akuntansi"),
  uploadSingle,
  updateDocument,
);
router.delete(
  "/documents/:id",
  authenticateToken,
  authorizeRoles("Admin", "Admin Akuntansi"),
  deleteDocument,
);
router.post(
  "/documents/history/:id/restore",
  authenticateToken,
  authorizeRoles("Admin", "Admin Akuntansi"),
  restoreDocumentFromHistory,
);
router.delete(
  "/documents/history/:id",
  authenticateToken,
  authorizeRoles("Admin", "Admin Akuntansi"),
  permanentlyDeleteDocumentFromHistory,
);

export default router;

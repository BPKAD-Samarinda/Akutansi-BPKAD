import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { BACKEND_UPLOADS_DIR } from "../config/uploadPaths";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { createSkpDocument, getSkpDocuments } from "../controllers/skpController";

const router = Router();

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    fs.mkdirSync(BACKEND_UPLOADS_DIR, { recursive: true });
    cb(null, BACKEND_UPLOADS_DIR);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
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
  storage,
  fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024,
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

    return next();
  });
};

router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Staff", "Admin Akuntansi", "Staff Akuntansi"),
  getSkpDocuments,
);

router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin", "Staff", "Admin Akuntansi", "Staff Akuntansi"),
  uploadSingle,
  createSkpDocument,
);

export default router;

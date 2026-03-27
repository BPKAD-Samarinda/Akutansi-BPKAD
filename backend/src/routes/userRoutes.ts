import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";
import { createUser, deleteUser, getUsers, updateUser } from "../controllers/userController";

const router = Router();

router.get("/", authenticateToken, authorizeRoles("Admin", "Admin Akuntansi"), getUsers);
router.post("/", authenticateToken, authorizeRoles("Admin", "Admin Akuntansi"), createUser);
router.put("/:id", authenticateToken, authorizeRoles("Admin", "Admin Akuntansi"), updateUser);
router.delete("/:id", authenticateToken, authorizeRoles("Admin", "Admin Akuntansi"), deleteUser);

export default router;

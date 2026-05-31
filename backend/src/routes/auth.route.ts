import express from "express";
import { login, logout } from "../controllers/auth.controller";
import { verifyJWT } from "../middlewares";

const router = express.Router();

router.post("/login", login);
router.post("/logout", verifyJWT, logout);

export default router;

import express from "express";
import {
  createUser,
  updateUser,
  deleteUser,
  getAll,
  getMe,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares";

const router = express.Router();

router.post("/createUser", verifyJWT, createUser);
router.patch("/updateUser/:id", verifyJWT, updateUser);
router.delete("/deleteUser/:id", verifyJWT, deleteUser);
router.get("/getAllUsers", verifyJWT, getAll);
router.get("/getMe", verifyJWT, getMe);

export default router;
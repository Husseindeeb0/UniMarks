import express from "express";
import {
  addMark,
  updateMark,
  deleteMark,
  getStudentMarks,
} from "../controllers/mark.controller";
import { verifyJWT } from "../middlewares";

const router = express.Router();

router.post("/addMark", verifyJWT, addMark);
router.patch("/updateMark", verifyJWT, updateMark);
router.delete("/deleteMark/:markId", verifyJWT, deleteMark);
router.get("/getStudentMarks/:studentId", verifyJWT, getStudentMarks);

export default router;

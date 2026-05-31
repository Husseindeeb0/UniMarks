import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "../controllers/course.controller";
import { verifyJWT } from "../middlewares";

const router = express.Router();

router.post("/addCourse", verifyJWT, createCourse);
router.get("/getCourses", verifyJWT, getCourses);
router.put("/updateCourse/:id", verifyJWT, updateCourse);
router.delete("/deleteCourse/:id", verifyJWT, deleteCourse);

export default router;

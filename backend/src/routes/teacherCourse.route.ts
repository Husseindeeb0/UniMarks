import express from "express";
import {
  assignTeacherToCourse,
  unassignTeacherToCourse,
  getTeacherCourses,
} from "../controllers/teacherCourse.controller";
import { verifyJWT } from "../middlewares";
const router = express.Router();

router.post("/assignTeacher", verifyJWT, assignTeacherToCourse);
router.delete("/unassignTeacher/:assignmentId", verifyJWT, unassignTeacherToCourse);
router.get("/getTeacherCourses/:teacherId", verifyJWT, getTeacherCourses);

export default router;
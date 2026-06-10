import express from "express";
import {
  enrollStudent,
  unenrollStudent,
  getEnrolledCourses,
  getCourseStudents,
} from "../controllers/courseEnrollment.controller";
import { verifyJWT } from "../middlewares";

const router = express.Router();

router.post("/enrollStudent", verifyJWT, enrollStudent);
router.delete("/unenrollStudent/:enrollmentId", verifyJWT, unenrollStudent);
router.get("/getEnrolledCourses/:studentId", verifyJWT, getEnrolledCourses);
router.get("/getCourseStudents/:courseId", verifyJWT, getCourseStudents);

export default router;

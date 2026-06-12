"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseEnrollment_controller_1 = require("../controllers/courseEnrollment.controller");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.post("/enrollStudent", middlewares_1.verifyJWT, courseEnrollment_controller_1.enrollStudent);
router.delete("/unenrollStudent/:enrollmentId", middlewares_1.verifyJWT, courseEnrollment_controller_1.unenrollStudent);
router.get("/getEnrolledCourses/:studentId", middlewares_1.verifyJWT, courseEnrollment_controller_1.getEnrolledCourses);
router.get("/getCourseStudents/:courseId", middlewares_1.verifyJWT, courseEnrollment_controller_1.getCourseStudents);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacherCourse_controller_1 = require("../controllers/teacherCourse.controller");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.post("/assignTeacher", middlewares_1.verifyJWT, teacherCourse_controller_1.assignTeacherToCourse);
router.delete("/unassignTeacher/:assignmentId", middlewares_1.verifyJWT, teacherCourse_controller_1.unassignTeacherToCourse);
router.get("/getTeacherCourses/:teacherId", middlewares_1.verifyJWT, teacherCourse_controller_1.getTeacherCourses);
exports.default = router;

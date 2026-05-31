"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const course_controller_1 = require("../controllers/course.controller");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.post("/addCourse", middlewares_1.verifyJWT, course_controller_1.createCourse);
router.get("/getCourses", middlewares_1.verifyJWT, course_controller_1.getCourses);
router.put("/updateCourse/:id", middlewares_1.verifyJWT, course_controller_1.updateCourse);
router.delete("/deleteCourse/:id", middlewares_1.verifyJWT, course_controller_1.deleteCourse);
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mark_controller_1 = require("../controllers/mark.controller");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.post("/addMark", middlewares_1.verifyJWT, mark_controller_1.addMark);
router.patch("/updateMark", middlewares_1.verifyJWT, mark_controller_1.updateMark);
router.delete("/deleteMark/:markId", middlewares_1.verifyJWT, mark_controller_1.deleteMark);
router.get("/getStudentMarks/:studentId", middlewares_1.verifyJWT, mark_controller_1.getStudentMarks);
exports.default = router;

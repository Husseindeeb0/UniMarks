"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentMarks = exports.deleteMark = exports.updateMark = exports.addMark = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const addMark = async (req, res) => {
    const { courseId, studentId, score } = req.body;
    if (!courseId || !studentId || !score) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existMark = await prisma_1.default.mark.findFirst({
            where: {
                courseId: Number(courseId),
                studentId: Number(studentId)
            }
        });
        if (existMark) {
            return res.status(400).json({ message: "Mark already added" });
        }
        const mark = await prisma_1.default.mark.create({
            data: {
                courseId: Number(courseId),
                studentId: Number(studentId),
                score: score
            }
        });
        return res.status(200).json(mark);
    }
    catch (error) {
        console.error("Error adding mark for the student: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.addMark = addMark;
const updateMark = async (req, res) => {
    const { markId, score } = req.body;
    if (!markId || !score) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const mark = await prisma_1.default.mark.findFirst({
            where: {
                id: Number(markId),
            }
        });
        if (!mark) {
            return res.status(404).json({ message: "Mark not found" });
        }
        const updatedMark = await prisma_1.default.mark.update({
            where: {
                id: Number(markId)
            },
            data: {
                score: score
            }
        });
        return res.status(200).json(updatedMark);
    }
    catch (error) {
        console.error("Error updating mark for the student: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateMark = updateMark;
const deleteMark = async (req, res) => {
    const { markId } = req.params;
    if (!markId) {
        return res.status(400).json({ message: "Mark ID is required" });
    }
    try {
        const mark = await prisma_1.default.mark.findFirst({
            where: {
                id: Number(markId),
            }
        });
        if (!mark) {
            return res.status(404).json({ message: "Mark not found" });
        }
        await prisma_1.default.mark.delete({
            where: {
                id: Number(markId)
            }
        });
        return res.status(200).json({ message: "Mark deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting mark: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteMark = deleteMark;
const getStudentMarks = async (req, res) => {
    const studentId = req.params.studentId || req.body.studentId;
    if (!studentId) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const marks = await prisma_1.default.mark.findMany({
            where: {
                studentId: Number(studentId),
            },
            include: {
                course: true
            }
        });
        return res.status(200).json(marks);
    }
    catch (error) {
        console.error("Error getting student marks: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getStudentMarks = getStudentMarks;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourses = exports.deleteCourse = exports.updateCourse = exports.createCourse = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createCourse = async (req, res) => {
    const { name, code } = req.body;
    if (!name || !code) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const exists = await prisma_1.default.course.findUnique({
            where: { code },
        });
        if (exists) {
            return res.status(400).json({ message: "Course already exists" });
        }
        const course = await prisma_1.default.course.create({
            data: { name, code },
        });
        res.status(201).json(course);
    }
    catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createCourse = createCourse;
const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;
    try {
        const course = await prisma_1.default.course.findUnique({
            where: { id: Number(id) },
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const dataToUpdate = {};
        if (name && name !== course.name) {
            dataToUpdate.name = name;
        }
        if (code && code !== course.code) {
            dataToUpdate.code = code;
        }
        const updatedCourse = await prisma_1.default.course.update({
            where: { id: Number(id) },
            data: dataToUpdate,
        });
        res.status(200).json(updatedCourse);
    }
    catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateCourse = updateCourse;
const deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await prisma_1.default.course.findUnique({
            where: { id: Number(id) },
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        await prisma_1.default.course.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: "Course deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteCourse = deleteCourse;
const getCourses = async (req, res) => {
    try {
        const courses = await prisma_1.default.course.findMany({
            include: {
                teacherCourses: {
                    include: {
                        teacher: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json(courses);
    }
    catch (error) {
        console.error("Error getting courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getCourses = getCourses;

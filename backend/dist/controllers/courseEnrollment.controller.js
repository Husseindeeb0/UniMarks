"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseStudents = exports.getEnrolledCourses = exports.unenrollStudent = exports.enrollStudent = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const enrollStudent = async (req, res) => {
    const { courseId, studentId } = req.body;
    if (!courseId || !studentId) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingEnrollment = await prisma_1.default.courseEnrollment.findFirst({
            where: {
                courseId: Number(courseId),
                studentId: Number(studentId),
            },
        });
        if (existingEnrollment) {
            return res
                .status(400)
                .json({ message: "Student is already enrolled in this course" });
        }
        const enrollment = await prisma_1.default.courseEnrollment.create({
            data: {
                courseId,
                studentId,
            },
        });
        res.status(201).json(enrollment);
    }
    catch (error) {
        console.error("Error enrolling student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.enrollStudent = enrollStudent;
const unenrollStudent = async (req, res) => {
    const { enrollmentId } = req.params;
    try {
        const enrollment = await prisma_1.default.courseEnrollment.findUnique({
            where: { id: Number(enrollmentId) },
        });
        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        await prisma_1.default.courseEnrollment.delete({
            where: { id: Number(enrollmentId) },
        });
        res.status(200).json({ message: "Student unenrolled successfully" });
    }
    catch (error) {
        console.error("Error unenrolling student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.unenrollStudent = unenrollStudent;
const getEnrolledCourses = async (req, res) => {
    const { studentId } = req.params;
    try {
        const enrollments = await prisma_1.default.courseEnrollment.findMany({
            where: { studentId: Number(studentId) },
            include: {
                course: true,
            },
        });
        res.status(200).json(enrollments);
    }
    catch (error) {
        console.error("Error getting enrolled courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getEnrolledCourses = getEnrolledCourses;
const getCourseStudents = async (req, res) => {
    const { courseId } = req.params;
    try {
        const enrollments = await prisma_1.default.courseEnrollment.findMany({
            where: { courseId: Number(courseId) },
            include: {
                student: {
                    include: {
                        marks: {
                            where: { courseId: Number(courseId) }
                        }
                    }
                }
            }
        });
        res.status(200).json(enrollments);
    }
    catch (error) {
        console.error("Error getting course students:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getCourseStudents = getCourseStudents;

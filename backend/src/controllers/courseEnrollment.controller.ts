import { Request, Response } from "express";
import prisma from "../config/prisma";

export const enrollStudent = async (req: Request, res: Response) => {
  const { courseId, studentId } = req.body;

  if (!courseId || !studentId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingEnrollment = await prisma.courseEnrollment.findFirst({
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

    const enrollment = await prisma.courseEnrollment.create({
      data: {
        courseId,
        studentId,
      },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unenrollStudent = async (req: Request, res: Response) => {
  const { enrollmentId } = req.params;

  try {
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: { id: Number(enrollmentId) },
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    await prisma.courseEnrollment.delete({
      where: { id: Number(enrollmentId) },
    });

    res.status(200).json({ message: "Student unenrolled successfully" });
  } catch (error) {
    console.error("Error unenrolling student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getEnrolledCourses = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    const enrollments = await prisma.courseEnrollment.findMany({
      where: { studentId: Number(studentId) },
      include: {
        course: true,
      },
    });

    res.status(200).json(enrollments);
  } catch (error) {
    console.error("Error getting enrolled courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getCourseStudents = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const enrollments = await prisma.courseEnrollment.findMany({
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
  } catch (error) {
    console.error("Error getting course students:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
import { Request, Response } from "express";
import prisma from "../config/prisma";

export const assignTeacherToCourse = async (req: Request, res: Response) => {
  const { courseId, teacherId } = req.body;

  if (!courseId || !teacherId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingTeacherCourse = await prisma.teacherCourse.findFirst({
      where: {
        courseId: Number(courseId),
        teacherId: Number(teacherId),
      },
    });

    if (existingTeacherCourse) {
      return res
        .status(400)
        .json({ message: "Teacher is already assigned to this course" });
    }

    const teacherCourse = await prisma.teacherCourse.create({
      data: {
        courseId,
        teacherId,
      },
    });

    res.status(201).json(teacherCourse);
  } catch (error) {
    console.error("Error assigning teacher to course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unassignTeacherToCourse = async (req: Request, res: Response) => {
  const { assignmentId } = req.params;

  if (!assignmentId) {
    return res.status(400).json({ message: "Assignment ID is required" });
  }

  try {
    const existingTeacherCourse = await prisma.teacherCourse.findFirst({
      where: {
        id: Number(assignmentId)
      },
    })

    if (!existingTeacherCourse) {
      return res.status(404).json({ message: "Teacher is not assigned to this course"})
    }

    await prisma.teacherCourse.delete({
      where: {
        id: Number(existingTeacherCourse.id)
      }
    })

    res.status(200).json({ message: "Teacher unassigned successfully"})
  } catch (error) {
    console.error("Error unassigning teacher to course:", error);
    res.status(500).json({ message: "Internal server error"})
  }
}

export const getTeacherCourses = async (req: Request, res: Response) => {
  const { teacherId } = req.params;

  if (!teacherId) {
    return res.status(400).json({ message: "Teacher ID is required" });
  }

  try {
    const teacherCourses = await prisma.teacherCourse.findMany({
      where: {
        teacherId: Number(teacherId),
      },
      include: {
        course: {
          include: {
            _count: {
              select: { courseEnrollments: true }
            }
          }
        },
      },
    });

    res.status(200).json(teacherCourses);
  } catch (error) {
    console.error("Error getting teacher courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


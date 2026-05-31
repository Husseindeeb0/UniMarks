import { Request, Response } from "express";
import prisma from "../config/prisma";

export const createCourse = async (req: Request, res: Response) => {
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const exists = await prisma.course.findUnique({
      where: { code },
    });

    if (exists) {
      return res.status(400).json({ message: "Course already exists" });
    }

    const course = await prisma.course.create({
      data: { name, code },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, code } = req.body;

  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const dataToUpdate: any = {}

    if (name && name !== course.name) {
      dataToUpdate.name = name
    }
    if (code && code !== course.code) {
      dataToUpdate.code = code
    }

    const updatedCourse = await prisma.course.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteCourse = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: Number(id) },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await prisma.course.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
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
  } catch (error) {
    console.error("Error getting courses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
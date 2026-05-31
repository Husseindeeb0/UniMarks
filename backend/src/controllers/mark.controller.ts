import { Request, Response } from "express";
import prisma from "../config/prisma";

export const addMark = async (req: Request, res: Response) => {
  const { courseId, studentId, score } = req.body;
  
  if (!courseId || !studentId || !score) {
    return res.status(400).json({ message: "All fields are required"});
  }

  try {
    const existMark = await prisma.mark.findFirst({
      where: {
        courseId: Number(courseId),
        studentId: Number(studentId)
      }
    })

    if (existMark) {
      return res.status(400).json({ message: "Mark already added"});
    }

    const mark = await prisma.mark.create({
      data: {
        courseId: Number(courseId),
        studentId: Number(studentId),
        score: score
      }
    })

    return res.status(200).json(mark);
  } catch (error) {
    console.error("Error adding mark for the student: ", error);
    res.status(500).json({ message: "Internal server error"});
  }
}

export const updateMark = async (req: Request, res: Response) => {
  const { markId, score } = req.body;

  if (!markId || !score) {
    return res.status(400).json({ message: "All fields are required"});
  }

  try {
    const mark = await prisma.mark.findFirst({
      where: {
        id: Number(markId),
      }
    })

    if (!mark) {
      return res.status(404).json({ message: "Mark not found"});
    }

    const updatedMark = await prisma.mark.update({
      where: {
        id: Number(markId)
      },
      data: {
        score: score
      }
    })

    return res.status(200).json(updatedMark);
  } catch (error) {
    console.error("Error updating mark for the student: ", error);
    res.status(500).json({ message: "Internal server error"});
  }
}

export const deleteMark = async (req: Request, res: Response) => {
  const { markId } = req.params;

  if (!markId) {
    return res.status(400).json({ message: "Mark ID is required"});
  }

  try {
    const mark = await prisma.mark.findFirst({
      where: {
        id: Number(markId),
      }
    })

    if (!mark) {
      return res.status(404).json({ message: "Mark not found"});
    }

    await prisma.mark.delete({
      where: {
        id: Number(markId)
      }
    })

    return res.status(200).json({ message: "Mark deleted successfully"});
  } catch (error) {
    console.error("Error deleting mark: ", error);
    res.status(500).json({ message: "Internal server error"});
  }
}

export const getStudentMarks = async (req: Request, res: Response) => {
  const studentId = req.params.studentId || req.body.studentId;

  if (!studentId) {
    return res.status(400).json({ message: "All fields are required"});
  }

  try {
    const marks = await prisma.mark.findMany({
      where: {
        studentId: Number(studentId),
      },
      include: {
        course: true
      }
    })

    return res.status(200).json(marks);
  } catch (error) {
    console.error("Error getting student marks: ", error);
    res.status(500).json({ message: "Internal server error"});
  }
}
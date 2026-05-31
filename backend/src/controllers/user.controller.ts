import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as Role,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const dataToUpdate: any = {};

    if (name && name !== user.name) {
      dataToUpdate.name = name;
    }

    if (email && email !== user.email) {
      dataToUpdate.email = email;
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashed;
    }

    if (role && role !== user.role) {
      dataToUpdate.role = role as Role;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();

    res.status(200).json(users);
  } catch (error) {
    console.error("Error getting all users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
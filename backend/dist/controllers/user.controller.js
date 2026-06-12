"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.getAll = exports.deleteUser = exports.updateUser = exports.createUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const exists = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role,
            },
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createUser = createUser;
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: Number(id) },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const dataToUpdate = {};
        if (name && name !== user.name) {
            dataToUpdate.name = name;
        }
        if (email && email !== user.email) {
            dataToUpdate.email = email;
        }
        if (password) {
            const hashed = await bcrypt_1.default.hash(password, 10);
            dataToUpdate.password = hashed;
        }
        if (role && role !== user.role) {
            dataToUpdate.role = role;
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { id: Number(id) },
            data: dataToUpdate,
        });
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: Number(id) },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await prisma_1.default.user.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.deleteUser = deleteUser;
const getAll = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany();
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error getting all users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAll = getAll;
const getMe = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getMe = getMe;

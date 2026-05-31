"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../utils");
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const passwordMatch = await bcrypt_1.default.compareSync(password, user.password);
        if (!passwordMatch || user.email !== email) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const accessToken = (0, utils_1.generateToken)(user);
        const refreshToken = (0, utils_1.generateRefreshToken)(user);
        (0, utils_1.setTokenCookies)(res, accessToken, refreshToken);
        res.status(200).json({ message: "Login successful" });
    }
    catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.logout = logout;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.setTokenCookies = exports.generateToken = exports.generateRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const generateToken = (user) => {
    const secret = process.env.ACCESS_SECRET_TOKEN;
    if (!secret) {
        throw new Error("ACCESS_SECRET_TOKEN is not defined in environment variables");
    }
    return jsonwebtoken_1.default.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }, secret, {
        expiresIn: "1h",
    });
};
exports.generateToken = generateToken;
const generateRefreshToken = (user) => {
    const secret = process.env.REFRESH_SECRET_TOKEN;
    if (!secret) {
        throw new Error("REFRESH_SECRET_TOKEN is not defined in environment variables");
    }
    return jsonwebtoken_1.default.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }, secret, { expiresIn: "7d" });
};
exports.generateRefreshToken = generateRefreshToken;
const setTokenCookies = async (res, accessToken, refreshToken) => {
    res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
    });
    res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });
};
exports.setTokenCookies = setTokenCookies;
const verifyToken = (token, type = "access") => {
    try {
        const secret = type === "access"
            ? process.env.ACCESS_SECRET_TOKEN
            : process.env.REFRESH_SECRET_TOKEN;
        if (!secret) {
            throw new Error("ACCESS_SECRET_TOKEN or REFRESH_SECRET_TOKEN is not defined in environment variables");
        }
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        console.error(`Token verification failed (${type}):`, error);
        return null;
    }
};
exports.verifyToken = verifyToken;

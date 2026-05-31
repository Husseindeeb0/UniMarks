"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = verifyJWT;
const utils_1 = require("../utils");
const prisma_1 = __importDefault(require("../config/prisma"));
async function verifyJWT(req, res, next) {
    try {
        let accessToken = req.cookies.access_token;
        const refreshToken = req.cookies.refresh_token;
        if (!accessToken && !refreshToken) {
            return res.status(401).json({
                state: "AUTH_REQUIRED",
                message: "Authentication required",
            });
        }
        let decoded = accessToken ? (0, utils_1.verifyToken)(accessToken, "access") : null;
        if (!decoded && refreshToken) {
            const refreshDecoded = (0, utils_1.verifyToken)(refreshToken, "refresh");
            if (refreshDecoded &&
                typeof refreshDecoded !== "string" &&
                "id" in refreshDecoded) {
                const user = await prisma_1.default.user.findUnique({
                    where: { id: Number(refreshDecoded.id) },
                });
                if (user && user.refreshToken === refreshToken) {
                    const newAccessToken = (0, utils_1.generateToken)(user);
                    // Refresh token is generated every time to prevent reuse (security measure) this is called Refresh Token Rotation
                    const newRefreshToken = (0, utils_1.generateRefreshToken)(user);
                    (0, utils_1.setTokenCookies)(res, newAccessToken, newRefreshToken);
                    await prisma_1.default.user.update({
                        where: { id: user.id },
                        data: { refreshToken: newRefreshToken },
                    });
                    accessToken = newAccessToken;
                    decoded = (0, utils_1.verifyToken)(accessToken, "access");
                }
            }
        }
        if (!decoded ||
            typeof decoded === "string" ||
            !("id" in decoded) ||
            !("email" in decoded) ||
            !("role" in decoded)) {
            return res.status(401).json({
                state: "INVALID_TOKEN",
                message: "Invalid or expired session",
            });
        }
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({
            state: "AUTH_FAILED",
            message: "Authentication failed",
        });
    }
}

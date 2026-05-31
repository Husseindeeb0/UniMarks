"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const dbConnect = async () => {
    try {
        await prisma_1.default.$connect();
        console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};
exports.default = dbConnect;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log("Rejected origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Authorization", "Content-Type"],
};
exports.default = corsOptions;

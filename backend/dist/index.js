"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const course_route_1 = __importDefault(require("./routes/course.route"));
const courseEnrollment_route_1 = __importDefault(require("./routes/courseEnrollment.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const teacherCourse_route_1 = __importDefault(require("./routes/teacherCourse.route"));
const mark_route_1 = __importDefault(require("./routes/mark.route"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, dbConnect_1.default)();
app.use("/auth", auth_route_1.default);
app.use("/user", user_route_1.default);
app.use("/course", course_route_1.default);
app.use("/courseEnrollment", courseEnrollment_route_1.default);
app.use("/teacherCourse", teacherCourse_route_1.default);
app.use("/mark", mark_route_1.default);
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});

import express from 'express';
import dbConnect from './config/dbConnect';
import authRouter from "./routes/auth.route";
import courseRouter from "./routes/course.route";
import courseEnrollmentRouter from "./routes/courseEnrollment.route";
import userRouter from "./routes/user.route";
import teacherCourseRouter from "./routes/teacherCourse.route";
import markRouter from "./routes/mark.route";
import dotenv from "dotenv";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
dbConnect();

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/courseEnrollment", courseEnrollmentRouter);
app.use("/teacherCourse", teacherCourseRouter);
app.use("/mark", markRouter);

app.listen(3000, () => {
    console.log(`Server is running on port 3000`)
})

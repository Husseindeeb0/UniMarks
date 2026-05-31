import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../lib/axiosBaseQuery";

export const baseAPI = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Auth",
    "User",
    "Course",
    "CourseEnrollment",
    "TeacherCourse",
    "Mark",
  ],
  endpoints: () => ({}),
});

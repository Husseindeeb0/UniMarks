import { baseAPI } from "./baseAPI";

export const teacherCourseAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    assignTeacher: builder.mutation<void, { courseId: number; teacherId: number }>({
      query: (data) => ({
        url: "/teacherCourse/assignTeacher",
        method: "POST",
        data,
      }),
      invalidatesTags: ["TeacherCourse", "Course"],
    }),
    unassignTeacher: builder.mutation<void, number>({
      query: (assignmentId) => ({
        url: `/teacherCourse/unassignTeacher/${assignmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TeacherCourse", "Course"],
    }),
    getTeacherCourses: builder.query<any[], number>({
      query: (teacherId) => ({
        url: `/teacherCourse/getTeacherCourses/${teacherId}`,
        method: "GET",
      }),
      providesTags: ["TeacherCourse"],
    }),
  }),
});

export const {
  useAssignTeacherMutation,
  useUnassignTeacherMutation,
  useGetTeacherCoursesQuery,
} = teacherCourseAPI;

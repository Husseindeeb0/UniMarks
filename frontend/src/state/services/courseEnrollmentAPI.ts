import { baseAPI } from "./baseAPI";

export const courseEnrollmentAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEnrolledCourses: builder.query<any[], number>({
      query: (studentId) => ({
        url: `/courseEnrollment/getEnrolledCourses/${studentId}`,
        method: "GET",
      }),
      providesTags: ["CourseEnrollment"],
    }),
    getCourseStudents: builder.query<any[], number>({
      query: (courseId) => ({
        url: `/courseEnrollment/getCourseStudents/${courseId}`,
        method: "GET",
      }),
      providesTags: ["CourseEnrollment", "Mark"], // Also provides Marks since we display them
    }),
    enrollStudent: builder.mutation<void, { courseId: number; studentId: number }>({
      query: (data) => ({
        url: `/courseEnrollment/enrollStudent`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["CourseEnrollment"],
    }),
    unenrollStudent: builder.mutation<void, number>({
      query: (enrollmentId) => ({
        url: `/courseEnrollment/unenrollStudent/${enrollmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CourseEnrollment"],
    }),
  }),
});

export const {
  useGetEnrolledCoursesQuery,
  useGetCourseStudentsQuery,
  useEnrollStudentMutation,
  useUnenrollStudentMutation,
} = courseEnrollmentAPI;

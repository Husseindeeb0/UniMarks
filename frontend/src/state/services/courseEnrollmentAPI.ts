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
  useEnrollStudentMutation,
  useUnenrollStudentMutation,
} = courseEnrollmentAPI;

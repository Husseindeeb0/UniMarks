import { baseAPI } from "./baseAPI";

export const courseAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<any[], void>({
      query: () => ({
        url: "/course/getCourses",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    addCourse: builder.mutation<void, { name: string; code: string }>({
      query: (data) => ({
        url: "/course/addCourse",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Course"],
    }),
    updateCourse: builder.mutation<
      void,
      { id: number; name?: string; code?: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/course/updateCourse/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Course"],
    }),
    deleteCourse: builder.mutation<void, number>({
      query: (id) => ({
        url: `/course/deleteCourse/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course", "TeacherCourse", "CourseEnrollment", "Mark"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseAPI;

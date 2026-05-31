import { baseAPI } from "./baseAPI";

export const markAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    addMark: builder.mutation<void, { courseId: number; studentId: number; score: number }>({
      query: (data) => ({
        url: "/mark/addMark",
        method: "POST",
        data,
      }),
      // Invalidate both Mark and TeacherCourse so the Teacher Dashboard
      // automatically refetches and reflects the new mark without any manual refresh.
      invalidatesTags: ["Mark", "TeacherCourse"],
    }),
    updateMark: builder.mutation<void, { markId: number; score: number }>({
      query: (data) => ({
        url: "/mark/updateMark",
        method: "PATCH",
        data,
      }),
      // Same as addMark: keep Teacher Dashboard in sync.
      invalidatesTags: ["Mark", "TeacherCourse"],
    }),
    deleteMark: builder.mutation<void, number>({
      query: (markId) => ({
        url: `/mark/deleteMark/${markId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Mark", "TeacherCourse"],
    }),
    getStudentMarks: builder.query<any[], number>({
      query: (studentId) => ({
        url: `/mark/getStudentMarks/${studentId}`,
        method: "GET",
      }),
      providesTags: ["Mark"],
    }),
  }),
});

export const {
  useAddMarkMutation,
  useUpdateMarkMutation,
  useDeleteMarkMutation,
  useGetStudentMarksQuery,
} = markAPI;
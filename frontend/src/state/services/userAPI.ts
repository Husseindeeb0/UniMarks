import { baseAPI } from "./baseAPI";
import type { UserType } from "../../types";

export const userAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createUser: builder.mutation<UserType, Partial<UserType>>({
      query: (data) => ({
        url: "/user/createUser",
        method: "POST",
        data,
      }),
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query<UserType[], void>({
      query: () => ({
        url: "/user/getAllUsers",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/user/deleteUser/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "TeacherCourse", "CourseEnrollment"],
    }),
    updateUser: builder.mutation<UserType, Partial<UserType>>({
      query: (data) => ({
        url: `/user/updateUser/${data.id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query<UserType, void>({
      query: () => ({
        url: "/user/getMe",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useCreateUserMutation,
  useGetMeQuery,
} = userAPI;
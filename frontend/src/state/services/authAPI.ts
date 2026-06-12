import { baseAPI } from "./baseAPI";
import type { UserType } from "../../types";

export const authAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ message: string }, Partial<UserType>>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        data: credentials,
      }),
      invalidatesTags: (_, error) => (error ? [] : ["Auth"]),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),
    checkAuth: builder.query<UserType, void>({
      query: () => ({
        url: "/user/getMe",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useCheckAuthQuery } =
  authAPI;

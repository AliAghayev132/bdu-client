import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/admin/auth/logout',
        method: 'POST',
      }),
    }),

    verifyToken: builder.query({
      query: () => '/admin/auth/verify',
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useVerifyTokenQuery,
} = authApi;

import { baseApi } from './baseApi';

export const rectorAppealsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRectorAppeals: builder.query({
      query: ({ page = 1, limit = 20, status, category, priority, showDeleted = false }) => ({
        url: '/admin/rector-appeals',
        params: { page, limit, status, category, priority, showDeleted: showDeleted.toString() },
      }),
      providesTags: ['RectorAppeals'],
    }),
    getRectorAppealById: builder.query({
      query: (id) => `/admin/rector-appeals/${id}`,
      providesTags: (result, error, id) => [{ type: 'RectorAppeals', id }],
    }),
    getRectorAppealStats: builder.query({
      query: () => '/admin/rector-appeals/stats',
      providesTags: ['RectorAppealStats'],
    }),
    updateRectorAppeal: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/rector-appeals/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RectorAppeals', id },
        'RectorAppeals',
        'RectorAppealStats',
      ],
    }),
    deleteRectorAppeal: builder.mutation({
      query: (id) => ({
        url: `/admin/rector-appeals/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RectorAppeals', 'RectorAppealStats'],
    }),
    restoreRectorAppeal: builder.mutation({
      query: (id) => ({
        url: `/admin/rector-appeals/${id}/restore`,
        method: 'PATCH',
      }),
      invalidatesTags: ['RectorAppeals', 'RectorAppealStats'],
    }),
  }),
});

export const {
  useGetRectorAppealsQuery,
  useGetRectorAppealByIdQuery,
  useGetRectorAppealStatsQuery,
  useUpdateRectorAppealMutation,
  useDeleteRectorAppealMutation,
  useRestoreRectorAppealMutation,
} = rectorAppealsApi;

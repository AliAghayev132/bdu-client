import { baseApi } from './baseApi';

export const logsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getLogs: builder.query({
      query: ({ 
        page = 1, 
        limit = 20, 
        type = 'all',
        startDate = '',
        endDate = '',
        search = '',
      }) => ({
        url: '/admin/logs',
        params: { 
          page, 
          limit, 
          type: type !== 'all' ? type : undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          search: search || undefined,
        },
      }),
      transformResponse: (response) => ({
        logs: response.data || [],
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.pages || 1,
        currentPage: response.pagination?.page || 1,
      }),
      providesTags: (result) =>
        result?.logs
          ? [
              ...result.logs.map(({ _id }) => ({ type: 'Logs', id: _id })),
              { type: 'Logs', id: 'LIST' },
            ]
          : [{ type: 'Logs', id: 'LIST' }],
    }),

    getLogById: builder.query({
      query: (id) => `/admin/logs/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Logs', id }],
    }),

    clearLogs: builder.mutation({
      query: ({ type, beforeDate }) => ({
        url: '/admin/logs/clear',
        method: 'DELETE',
        body: { type, beforeDate },
      }),
      invalidatesTags: [{ type: 'Logs', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetLogsQuery,
  useGetLogByIdQuery,
  useClearLogsMutation,
} = logsApi;

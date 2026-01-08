import { baseApi } from './baseApi';

export const newsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        search = '', 
        category = 'all',
        showDeleted = false,
        startDate = '',
        endDate = ''
      }) => ({
        url: '/admin/news',
        params: { 
          page, 
          limit, 
          search,
          category: category !== 'all' ? category : undefined,
          showDeleted: showDeleted.toString(),
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      }),
      transformResponse: (response) => ({
        news: response.data || [],
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.pages || 1,
        currentPage: response.pagination?.page || 1,
      }),
      providesTags: (result) =>
        result?.news
          ? [
              ...result.news.map(({ _id }) => ({ type: 'News', id: _id })),
              { type: 'News', id: 'LIST' },
            ]
          : [{ type: 'News', id: 'LIST' }],
    }),

    getNewsById: builder.query({
      query: (id) => `/admin/news/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'News', id }],
    }),

    createNews: builder.mutation({
      query: (formData) => ({
        url: '/admin/news',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'News', id: 'LIST' }],
    }),

    updateNews: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/news/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'News', id },
        { type: 'News', id: 'LIST' },
      ],
    }),

    deleteNews: builder.mutation({
      query: (id) => ({
        url: `/admin/news/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'News', id: 'LIST' }],
    }),

    togglePublish: builder.mutation({
      query: (id) => ({
        url: `/admin/news/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'News', id },
        { type: 'News', id: 'LIST' },
      ],
    }),

    uploadImage: builder.mutation({
      query: (formData) => ({
        url: '/admin/news/upload-image',
        method: 'POST',
        body: formData,
      }),
    }),

    restoreNews: builder.mutation({
      query: (id) => ({
        url: `/admin/news/${id}/restore`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'News', id: 'LIST' }],
    }),

    permanentDeleteNews: builder.mutation({
      query: (id) => ({
        url: `/admin/news/${id}/permanent`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'News', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useTogglePublishMutation,
  useUploadImageMutation,
  useRestoreNewsMutation,
  usePermanentDeleteNewsMutation,
} = newsApi;

import { baseApi } from './baseApi';

export const pagesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPages: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        search = '', 
        pageType = 'all',
        showDeleted = false,
      }) => ({
        url: '/admin/pages',
        params: { 
          page, 
          limit, 
          search,
          pageType: pageType !== 'all' ? pageType : undefined,
          showDeleted: showDeleted.toString(),
        },
      }),
      transformResponse: (response) => ({
        pages: response.data || [],
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.pages || 1,
        currentPage: response.pagination?.page || 1,
      }),
      providesTags: (result) =>
        result?.pages
          ? [
              ...result.pages.map(({ _id }) => ({ type: 'Pages', id: _id })),
              { type: 'Pages', id: 'LIST' },
            ]
          : [{ type: 'Pages', id: 'LIST' }],
    }),

    getPageById: builder.query({
      query: (id) => `/admin/pages/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Pages', id }],
    }),

    createPage: builder.mutation({
      query: (formData) => ({
        url: '/admin/pages',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Pages', id: 'LIST' }],
    }),

    updatePage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/pages/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Pages', id },
        { type: 'Pages', id: 'LIST' },
      ],
    }),

    deletePage: builder.mutation({
      query: (id) => ({
        url: `/admin/pages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Pages', id: 'LIST' }],
    }),

    togglePublishPage: builder.mutation({
      query: (id) => ({
        url: `/admin/pages/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Pages', id },
        { type: 'Pages', id: 'LIST' },
      ],
    }),

    // Column management mutations for personPage
    addPageColumn: builder.mutation({
      query: ({ pageId, data }) => ({
        url: `/admin/pages/${pageId}/columns`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { pageId }) => [
        { type: 'Pages', id: pageId },
        { type: 'Pages', id: 'LIST' },
      ],
    }),

    updatePageColumn: builder.mutation({
      query: ({ pageId, columnIndex, data }) => ({
        url: `/admin/pages/${pageId}/columns/${columnIndex}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { pageId }) => [
        { type: 'Pages', id: pageId },
        { type: 'Pages', id: 'LIST' },
      ],
    }),

    deletePageColumn: builder.mutation({
      query: ({ pageId, columnIndex }) => ({
        url: `/admin/pages/${pageId}/columns/${columnIndex}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { pageId }) => [
        { type: 'Pages', id: pageId },
        { type: 'Pages', id: 'LIST' },
      ],
    }),

    reorderPageColumns: builder.mutation({
      query: ({ pageId, columns }) => ({
        url: `/admin/pages/${pageId}/columns/reorder`,
        method: 'POST',
        body: { columns },
      }),
      invalidatesTags: (result, error, { pageId }) => [
        { type: 'Pages', id: pageId },
        { type: 'Pages', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetPagesQuery,
  useGetPageByIdQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
  useDeletePageMutation,
  useTogglePublishPageMutation,
  useAddPageColumnMutation,
  useUpdatePageColumnMutation,
  useDeletePageColumnMutation,
  useReorderPageColumnsMutation,
} = pagesApi;

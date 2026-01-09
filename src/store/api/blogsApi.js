import { baseApi } from './baseApi';

export const blogsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        search = '', 
        category = 'all',
        showDeleted = false,
        startDate = '',
        endDate = ''
      }) => ({
        url: '/admin/blogs',
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
        blogs: response.data || [],
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.pages || 1,
        currentPage: response.pagination?.page || 1,
      }),
      providesTags: (result) =>
        result?.blogs
          ? [
              ...result.blogs.map(({ _id }) => ({ type: 'Blogs', id: _id })),
              { type: 'Blogs', id: 'LIST' },
            ]
          : [{ type: 'Blogs', id: 'LIST' }],
    }),

    getBlogById: builder.query({
      query: (id) => `/admin/blogs/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Blogs', id }],
    }),

    createBlog: builder.mutation({
      query: (formData) => ({
        url: '/admin/blogs',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Blogs', id: 'LIST' }],
    }),

    updateBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/blogs/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blogs', id },
        { type: 'Blogs', id: 'LIST' },
      ],
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/admin/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Blogs', id: 'LIST' }],
    }),

    togglePublishBlog: builder.mutation({
      query: (id) => ({
        url: `/admin/blogs/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blogs', id },
        { type: 'Blogs', id: 'LIST' },
      ],
    }),

    uploadBlogImage: builder.mutation({
      query: (formData) => ({
        url: '/admin/blogs/upload-image',
        method: 'POST',
        body: formData,
      }),
    }),

    restoreBlog: builder.mutation({
      query: (id) => ({
        url: `/admin/blogs/${id}/restore`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Blogs', id: 'LIST' }],
    }),

    permanentDeleteBlog: builder.mutation({
      query: (id) => ({
        url: `/admin/blogs/${id}/permanent`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Blogs', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useTogglePublishBlogMutation,
  useUploadBlogImageMutation,
  useRestoreBlogMutation,
  usePermanentDeleteBlogMutation,
} = blogsApi;

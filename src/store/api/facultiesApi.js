import { baseApi } from './baseApi';

export const facultiesApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getFaculties: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        search = '', 
        showInactive = false,
      }) => ({
        url: '/admin/faculties',
        params: { 
          page, 
          limit, 
          search,
          showInactive: showInactive.toString(),
        },
      }),
      transformResponse: (response) => ({
        faculties: response.data || [],
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.pages || 1,
        currentPage: response.pagination?.page || 1,
      }),
      providesTags: (result) =>
        result?.faculties
          ? [
              ...result.faculties.map(({ _id }) => ({ type: 'Faculties', id: _id })),
              { type: 'Faculties', id: 'LIST' },
            ]
          : [{ type: 'Faculties', id: 'LIST' }],
    }),

    getFacultyById: builder.query({
      query: (id) => `/admin/faculties/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Faculties', id }],
    }),

    createFaculty: builder.mutation({
      query: (formData) => ({
        url: '/admin/faculties',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Faculties', id: 'LIST' }],
    }),

    updateFaculty: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/faculties/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Faculties', id },
        { type: 'Faculties', id: 'LIST' },
      ],
    }),

    deleteFaculty: builder.mutation({
      query: (id) => ({
        url: `/admin/faculties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Faculties', id: 'LIST' }],
    }),

    toggleActiveFaculty: builder.mutation({
      query: (id) => ({
        url: `/admin/faculties/${id}/toggle-active`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Faculties', id },
        { type: 'Faculties', id: 'LIST' },
      ],
    }),

    uploadFacultyImage: builder.mutation({
      query: ({ type, formData }) => ({
        url: `/admin/faculties/upload-image/${type}`,
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetFacultiesQuery,
  useGetFacultyByIdQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useToggleActiveFacultyMutation,
  useUploadFacultyImageMutation,
} = facultiesApi;

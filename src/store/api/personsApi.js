import { baseApi } from './baseApi';

export const personsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPersons: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        search = '', 
        category = 'all',
        showInactive = false,
      }) => ({
        url: '/admin/persons',
        params: { 
          page, 
          limit, 
          search,
          category: category !== 'all' ? category : undefined,
          showInactive: showInactive.toString(),
        },
      }),
      transformResponse: (response) => ({
        persons: response.data || [],
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.pages || 1,
        currentPage: response.pagination?.page || 1,
      }),
      providesTags: (result) =>
        result?.persons
          ? [
              ...result.persons.map(({ _id }) => ({ type: 'Persons', id: _id })),
              { type: 'Persons', id: 'LIST' },
            ]
          : [{ type: 'Persons', id: 'LIST' }],
    }),

    getPersonById: builder.query({
      query: (id) => `/admin/persons/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Persons', id }],
    }),

    createPerson: builder.mutation({
      query: (formData) => ({
        url: '/admin/persons',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Persons', id: 'LIST' }],
    }),

    updatePerson: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/persons/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Persons', id },
        { type: 'Persons', id: 'LIST' },
      ],
    }),

    deletePerson: builder.mutation({
      query: (id) => ({
        url: `/admin/persons/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Persons', id: 'LIST' }],
    }),

    toggleActivePerson: builder.mutation({
      query: (id) => ({
        url: `/admin/persons/${id}/toggle-active`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Persons', id },
        { type: 'Persons', id: 'LIST' },
      ],
    }),

    uploadPersonImage: builder.mutation({
      query: (formData) => ({
        url: '/admin/persons/upload-image',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetPersonsQuery,
  useGetPersonByIdQuery,
  useCreatePersonMutation,
  useUpdatePersonMutation,
  useDeletePersonMutation,
  useToggleActivePersonMutation,
  useUploadPersonImageMutation,
} = personsApi;

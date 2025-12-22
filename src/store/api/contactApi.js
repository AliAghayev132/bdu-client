import { baseApi } from './baseApi';

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitContact: builder.mutation({
      query: (data) => ({
        url: '/contact',
        method: 'POST',
        body: data,
      }),
    }),

    getContacts: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        search = '', 
        status = 'all',
        showDeleted = false,
        startDate = '',
        endDate = ''
      }) => ({
        url: '/admin/contacts',
        params: { 
          page, 
          limit, 
          search,
          status: status !== 'all' ? status : undefined,
          showDeleted: showDeleted.toString(),
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      }),
      transformResponse: (response) => ({
        contacts: response.data || [],
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.pages || 1,
        currentPage: response.pagination?.page || 1,
      }),
      providesTags: (result) =>
        result?.contacts
          ? [
              ...result.contacts.map(({ _id }) => ({ type: 'Contacts', id: _id })),
              { type: 'Contacts', id: 'LIST' },
            ]
          : [{ type: 'Contacts', id: 'LIST' }],
    }),

    getContactById: builder.query({
      query: (id) => `/admin/contacts/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Contacts', id }],
    }),

    updateContactStatus: builder.mutation({
      query: ({ id, status, adminNotes }) => ({
        url: `/admin/contacts/${id}/status`,
        method: 'PATCH',
        body: { status, adminNotes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Contacts', id },
        { type: 'Contacts', id: 'LIST' },
      ],
    }),

    deleteContact: builder.mutation({
      query: (id) => ({
        url: `/admin/contacts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Contacts', id: 'LIST' }],
    }),

    restoreContact: builder.mutation({
      query: (id) => ({
        url: `/admin/contacts/${id}/restore`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Contacts', id: 'LIST' }],
    }),

    permanentDeleteContact: builder.mutation({
      query: (id) => ({
        url: `/admin/contacts/${id}/permanent`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Contacts', id: 'LIST' }],
    }),

    getContactStats: builder.query({
      query: () => '/admin/contacts/stats',
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useSubmitContactMutation,
  useGetContactsQuery,
  useGetContactByIdQuery,
  useUpdateContactStatusMutation,
  useDeleteContactMutation,
  useRestoreContactMutation,
  usePermanentDeleteContactMutation,
  useGetContactStatsQuery,
} = contactApi;

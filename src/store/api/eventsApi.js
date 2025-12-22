import { baseApi } from './baseApi';

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        search = '', 
        category = 'all',
        showDeleted = false,
        startDate = '',
        endDate = ''
      }) => ({
        url: '/admin/events',
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
        events: response.data || [],
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.pages || 1,
        currentPage: response.pagination?.page || 1,
      }),
      providesTags: (result) =>
        result?.events
          ? [
              ...result.events.map(({ _id }) => ({ type: 'Events', id: _id })),
              { type: 'Events', id: 'LIST' },
            ]
          : [{ type: 'Events', id: 'LIST' }],
    }),

    getEventById: builder.query({
      query: (id) => `/admin/events/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Events', id }],
    }),

    createEvent: builder.mutation({
      query: (formData) => ({
        url: '/admin/events',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Events', id: 'LIST' }],
    }),

    updateEvent: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/events/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Events', id },
        { type: 'Events', id: 'LIST' },
      ],
    }),

    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/admin/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Events', id: 'LIST' }],
    }),

    togglePublish: builder.mutation({
      query: (id) => ({
        url: `/admin/events/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Events', id },
        { type: 'Events', id: 'LIST' },
      ],
    }),

    uploadImage: builder.mutation({
      query: (formData) => ({
        url: '/admin/events/upload-image',
        method: 'POST',
        body: formData,
      }),
    }),

    restoreEvent: builder.mutation({
      query: (id) => ({
        url: `/admin/events/${id}/restore`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Events', id: 'LIST' }],
    }),

    permanentDeleteEvent: builder.mutation({
      query: (id) => ({
        url: `/admin/events/${id}/permanent`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Events', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useTogglePublishMutation,
  useUploadImageMutation,
  useRestoreEventMutation,
  usePermanentDeleteEventMutation,
} = eventsApi;

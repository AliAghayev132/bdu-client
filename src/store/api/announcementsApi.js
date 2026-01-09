import { baseApi } from './baseApi';

export const announcementsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: ({ 
        page = 1, 
        limit = 10, 
        search = '', 
        type = 'all',
        priority = 'all',
        showInactive = false,
        startDate = '',
        endDate = ''
      }) => ({
        url: '/admin/announcements',
        params: { 
          page, 
          limit, 
          search,
          type: type !== 'all' ? type : undefined,
          priority: priority !== 'all' ? priority : undefined,
          showInactive: showInactive.toString(),
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      }),
      transformResponse: (response) => ({
        announcements: response.data || [],
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.pages || 1,
        currentPage: response.pagination?.page || 1,
      }),
      providesTags: (result) =>
        result?.announcements
          ? [
              ...result.announcements.map(({ _id }) => ({ type: 'Announcements', id: _id })),
              { type: 'Announcements', id: 'LIST' },
            ]
          : [{ type: 'Announcements', id: 'LIST' }],
    }),

    getAnnouncementById: builder.query({
      query: (id) => `/admin/announcements/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Announcements', id }],
    }),

    createAnnouncement: builder.mutation({
      query: (formData) => ({
        url: '/admin/announcements',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Announcements', id: 'LIST' }],
    }),

    updateAnnouncement: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/admin/announcements/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Announcements', id },
        { type: 'Announcements', id: 'LIST' },
      ],
    }),

    deleteAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/admin/announcements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Announcements', id: 'LIST' }],
    }),

    togglePublishAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/admin/announcements/${id}/toggle-publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Announcements', id },
        { type: 'Announcements', id: 'LIST' },
      ],
    }),

    togglePinAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/admin/announcements/${id}/toggle-pin`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Announcements', id },
        { type: 'Announcements', id: 'LIST' },
      ],
    }),

    restoreAnnouncement: builder.mutation({
      query: (id) => ({
        url: `/admin/announcements/${id}/restore`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Announcements', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useGetAnnouncementByIdQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useTogglePublishAnnouncementMutation,
  useTogglePinAnnouncementMutation,
  useRestoreAnnouncementMutation,
} = announcementsApi;

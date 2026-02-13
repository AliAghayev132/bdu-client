import { baseApi } from './baseApi';

export const homePageApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get home page data (admin)
    getHomePage: builder.query({
      query: () => '/admin/home',
      transformResponse: (response) => response.data,
      providesTags: [{ type: 'HomePage', id: 'DATA' }],
    }),

    // Update home page
    updateHomePage: builder.mutation({
      query: (data) => ({
        url: '/admin/home',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'HomePage', id: 'DATA' }],
    }),

    // ============ Slides ============
    addSlide: builder.mutation({
      query: (formData) => ({
        url: '/admin/home/slides',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'HomePage', id: 'DATA' }],
    }),

    updateSlide: builder.mutation({
      query: ({ slideIndex, formData }) => ({
        url: `/admin/home/slides/${slideIndex}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: [{ type: 'HomePage', id: 'DATA' }],
    }),

    deleteSlide: builder.mutation({
      query: (slideIndex) => ({
        url: `/admin/home/slides/${slideIndex}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'HomePage', id: 'DATA' }],
    }),

    reorderSlides: builder.mutation({
      query: (slides) => ({
        url: '/admin/home/slides/reorder',
        method: 'POST',
        body: { slides },
      }),
      invalidatesTags: [{ type: 'HomePage', id: 'DATA' }],
    }),

    // ============ Prides ============
    addPride: builder.mutation({
      query: (formData) => ({
        url: '/admin/home/prides',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'HomePage', id: 'DATA' }],
    }),

    updatePride: builder.mutation({
      query: ({ prideIndex, formData }) => ({
        url: `/admin/home/prides/${prideIndex}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: [{ type: 'HomePage', id: 'DATA' }],
    }),

    deletePride: builder.mutation({
      query: (prideIndex) => ({
        url: `/admin/home/prides/${prideIndex}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'HomePage', id: 'DATA' }],
    }),

    reorderPrides: builder.mutation({
      query: (prides) => ({
        url: '/admin/home/prides/reorder',
        method: 'POST',
        body: { prides },
      }),
      invalidatesTags: [{ type: 'HomePage', id: 'DATA' }],
    }),

    // Toggle active
    toggleHomePageActive: builder.mutation({
      query: () => ({
        url: '/admin/home/toggle-active',
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'HomePage', id: 'DATA' }],
    }),

    // Public endpoint
    getPublicHomePage: builder.query({
      query: () => '/misc/home',
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetHomePageQuery,
  useUpdateHomePageMutation,
  useAddSlideMutation,
  useUpdateSlideMutation,
  useDeleteSlideMutation,
  useReorderSlidesMutation,
  useAddPrideMutation,
  useUpdatePrideMutation,
  useDeletePrideMutation,
  useReorderPridesMutation,
  useToggleHomePageActiveMutation,
  useGetPublicHomePageQuery,
} = homePageApi;

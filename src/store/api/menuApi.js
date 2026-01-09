import { baseApi } from './baseApi';

export const menuApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMenus: builder.query({
      query: () => '/admin/menu',
      transformResponse: (response) => response.data || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Menus', id: _id })),
              { type: 'Menus', id: 'LIST' },
            ]
          : [{ type: 'Menus', id: 'LIST' }],
    }),

    getMenuById: builder.query({
      query: (id) => `/admin/menu/${id}`,
      transformResponse: (response) => response.data,
      providesTags: (result, error, id) => [{ type: 'Menus', id }],
    }),

    createMenu: builder.mutation({
      query: (data) => ({
        url: '/admin/menu',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),

    updateMenu: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/menu/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Menus', id },
        { type: 'Menus', id: 'LIST' },
      ],
    }),

    deleteMenu: builder.mutation({
      query: (id) => ({
        url: `/admin/menu/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),

    toggleMenuActive: builder.mutation({
      query: (id) => ({
        url: `/admin/menu/${id}/toggle-active`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),

    reorderMenus: builder.mutation({
      query: (items) => ({
        url: '/admin/menu/reorder',
        method: 'POST',
        body: { items },
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),

    // Column CRUD
    addColumn: builder.mutation({
      query: ({ menuId, data }) => ({
        url: `/admin/menu/${menuId}/columns`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),

    updateColumn: builder.mutation({
      query: ({ menuId, columnIndex, data }) => ({
        url: `/admin/menu/${menuId}/columns/${columnIndex}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),

    deleteColumn: builder.mutation({
      query: ({ menuId, columnIndex }) => ({
        url: `/admin/menu/${menuId}/columns/${columnIndex}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),

    // Item CRUD
    addItem: builder.mutation({
      query: ({ menuId, columnIndex, data }) => ({
        url: `/admin/menu/${menuId}/columns/${columnIndex}/items`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),

    updateItem: builder.mutation({
      query: ({ menuId, columnIndex, itemIndex, data }) => ({
        url: `/admin/menu/${menuId}/columns/${columnIndex}/items/${itemIndex}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),

    deleteItem: builder.mutation({
      query: ({ menuId, columnIndex, itemIndex }) => ({
        url: `/admin/menu/${menuId}/columns/${columnIndex}/items/${itemIndex}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),

    // Subitem CRUD
    addSubitem: builder.mutation({
      query: ({ menuId, columnIndex, itemIndex, data }) => ({
        url: `/admin/menu/${menuId}/columns/${columnIndex}/items/${itemIndex}/subitems`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),

    updateSubitem: builder.mutation({
      query: ({ menuId, columnIndex, itemIndex, subitemIndex, data }) => ({
        url: `/admin/menu/${menuId}/columns/${columnIndex}/items/${itemIndex}/subitems/${subitemIndex}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),

    deleteSubitem: builder.mutation({
      query: ({ menuId, columnIndex, itemIndex, subitemIndex }) => ({
        url: `/admin/menu/${menuId}/columns/${columnIndex}/items/${itemIndex}/subitems/${subitemIndex}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Menus', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetMenusQuery,
  useGetMenuByIdQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useToggleMenuActiveMutation,
  useReorderMenusMutation,
  useAddColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useAddSubitemMutation,
  useUpdateSubitemMutation,
  useDeleteSubitemMutation,
} = menuApi;

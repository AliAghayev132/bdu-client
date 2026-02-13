import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '@store/slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  credentials: 'include',
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If token expired (401), try to refresh
  if (result?.error?.status === 401) {
    console.log('Token expired, attempting refresh...');
    
    // Try to refresh the token
    const refreshResult = await baseQuery(
      { url: '/admin/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult?.data?.accessToken) {
      // Store new token
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', refreshResult.data.accessToken);
      }
      
      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout user
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
      }
      api.dispatch(logout());
      window.location.href = '/admin/login';
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['News', 'Events', 'Gallery', 'Announcements', 'Stats', 'Contacts', 'Blogs', 'Pages', 'Menus', 'Persons', 'Faculties', 'Logs', 'RectorAppeals', 'RectorAppealStats', 'HomePage'],
  endpoints: () => ({}),
});

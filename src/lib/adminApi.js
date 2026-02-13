const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Helper function to convert relative image URLs to full URLs
export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}${path}`;
};

class AdminAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('adminToken');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(username, password) {
    const data = await this.request('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      skipAuth: true,
    });

    if (data.success && data.accessToken) {
      localStorage.setItem('adminToken', data.accessToken);
      localStorage.setItem('admin_user', JSON.stringify(data.admin));
    }

    return data;
  }

  async logout() {
    try {
      await this.request('/admin/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
  }

  async refreshToken() {
    const data = await this.request('/admin/auth/refresh', {
      method: 'POST',
    });

    if (data.success && data.accessToken) {
      localStorage.setItem('adminToken', data.accessToken);
    }

    return data;
  }

  async getNews(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/news?${query}`);
  }

  async getNewsById(id) {
    return this.request(`/admin/news/${id}`);
  }

  async createNews(newsData) {
    return this.request('/admin/news', {
      method: 'POST',
      body: JSON.stringify(newsData),
    });
  }

  async updateNews(id, newsData) {
    return this.request(`/admin/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(newsData),
    });
  }

  async deleteNews(id) {
    return this.request(`/admin/news/${id}`, {
      method: 'DELETE',
    });
  }

  async publishNews(id) {
    return this.request(`/admin/news/${id}/publish`, {
      method: 'PATCH',
    });
  }

  async togglePublishNews(id) {
    return this.request(`/admin/news/${id}/toggle-publish`, {
      method: 'PATCH',
    });
  }

  async uploadNewsImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseURL}/admin/news/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  }

  async getBlogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/blogs?${query}`);
  }

  async getBlogById(id) {
    return this.request(`/admin/blogs/${id}`);
  }

  async createBlog(blogData) {
    return this.request('/admin/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  }

  async updateBlog(id, blogData) {
    return this.request(`/admin/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
  }

  async deleteBlog(id) {
    return this.request(`/admin/blogs/${id}`, {
      method: 'DELETE',
    });
  }

  async publishBlog(id) {
    return this.request(`/admin/blogs/${id}/publish`, {
      method: 'PATCH',
    });
  }

  async uploadBlogImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${this.baseURL}/admin/blogs/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  }
}

export const adminApi = new AdminAPI();

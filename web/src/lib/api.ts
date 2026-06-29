import axios from 'axios'

const api = axios.create({
  baseURL: typeof window === 'undefined'
    ? (process.env.INTERNAL_API_URL ?? 'http://api:8000') + '/api'
    : '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('kite_access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const refresh = localStorage.getItem('kite_refresh_token')
      if (refresh) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken: refresh })
          localStorage.setItem('kite_access_token', data.accessToken)
          error.config.headers.Authorization = `Bearer ${data.accessToken}`
          return api(error.config)
        } catch {
          localStorage.removeItem('kite_access_token')
          localStorage.removeItem('kite_refresh_token')
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

// ── Typed helpers ─────────────────────────────────────────────────────────
export const authApi = {
  register:    (body: unknown) => api.post('/auth/register', body),
  login:       (body: unknown) => api.post('/auth/login', body),
  refresh:     (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  forgotPw:    (email: string) => api.post('/auth/forgot-password', { email }),
  resetPw:     (body: unknown) => api.post('/auth/reset-password', body),
  verifyEmail: (token: string) => api.get(`/auth/verify-email?token=${token}`),
  me:          () => api.get('/auth/me'),
}

export const listingsApi = {
  list:    (params?: Record<string, string | number>) => api.get('/listings', { params }),
  get:     (id: string) => api.get(`/listings/${id}`),
  create:  (body: unknown) => api.post('/listings', body),
  update:  (id: string, body: unknown) => api.patch(`/listings/${id}`, body),
  delete:  (id: string) => api.delete(`/listings/${id}`),
  mine:    (params?: Record<string, string | number>) => api.get('/listings/mine', { params }),
  boost:   (id: string, body: unknown) => api.post(`/listings/${id}/boost`, body),
  report:  (id: string, body: unknown) => api.post(`/listings/${id}/report`, body),
}

export const chatApi = {
  conversations: () => api.get('/chat/conversations'),
  messages:      (convId: string) => api.get(`/chat/conversations/${convId}/messages`),
  send:          (convId: string, body: unknown) => api.post(`/chat/conversations/${convId}/messages`, body),
  startConv:     (listingId: string) => api.post('/chat/conversations', { listingId }),
}

export const usersApi = {
  profile:       (id: string) => api.get(`/users/${id}/profile`),
  updateProfile: (body: unknown) => api.patch('/users/me', body),
  verify:        (body: unknown) => api.post('/users/me/verify', body),
  report:        (id: string, body: unknown) => api.post(`/users/${id}/report`, body),
}

export const reviewsApi = {
  mine:     () => api.get('/reviews/mine'),
  forUser:  (id: string) => api.get(`/reviews/user/${id}`),
  create:   (body: unknown) => api.post('/reviews', body),
}

export const favoritesApi = {
  list:    () => api.get('/favorites'),
  toggle:  (listingId: string) => api.post(`/favorites/${listingId}/toggle`),
}

export const plansApi = {
  list:     () => api.get('/plans'),
  checkout: (body: unknown) => api.post('/checkout', body),
}

export const bannersApi = {
  forSlot:   (slot: string) => api.get(`/banners/slot/${slot}`),
  impression:(id: string) => api.post(`/banners/${id}/impression`),
  click:     (id: string) => api.post(`/banners/${id}/click`),
}

export const adminApi = {
  stats:         () => api.get('/admin/stats'),
  users:         (params?: Record<string, string | number>) => api.get('/admin/users', { params }),
  listings:      (params?: Record<string, string | number>) => api.get('/admin/listings', { params }),
  reports:       (params?: Record<string, string | number>) => api.get('/admin/reports', { params }),
  banners:       (params?: Record<string, string | number>) => api.get('/admin/banners', { params }),
  createBanner:  (body: unknown) => api.post('/admin/banners', body),
  updateBanner:  (id: string, b: unknown) => api.patch(`/admin/banners/${id}`, b),
  deleteBanner:  (id: string) => api.delete(`/admin/banners/${id}`),
  moderateReport:(id: string, action: string) => api.post(`/admin/reports/${id}/moderate`, { action }),
  banUser:       (id: string) => api.post(`/admin/users/${id}/ban`),
  verifyUser:    (id: string) => api.post(`/admin/users/${id}/verify`),
}

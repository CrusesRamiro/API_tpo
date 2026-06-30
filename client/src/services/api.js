import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
})

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth') || 'null')
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})


api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const data = error.response?.data
    const message =
      (typeof data === 'string' && data) ||
      data?.message ||
      error.message ||
      'Error de conexión con el servidor'
    return Promise.reject(new Error(message))
  }
)

export default api
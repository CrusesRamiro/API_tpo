import api from './api'

export const login = (username, password) =>
  api.post('/auth/login', { username, password })

export const register = (data) => api.post('/usuarios', data)
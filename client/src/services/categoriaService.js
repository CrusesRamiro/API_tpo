import api from './api'

export const getCategorias = () => api.get('/categorias')
export const createCategoria = (data) => api.post('/categorias', data)
export const updateCategoria = (id, data) => api.put(`/categorias/${id}`, data)
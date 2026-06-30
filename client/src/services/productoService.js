import api from './api'

// Productos == entidad Item en el backend (/api/items).
export const getProductos = () => api.get('/items')
export const getProductoById = (id) => api.get(`/items/${id}`)
export const createProducto = (data) => api.post('/items', data)
export const updateProducto = (id, data) => api.put(`/items/${id}`, data)
export const deleteProducto = (id) => api.delete(`/items/${id}`)
import api from './api'

// Productos == entidad Item en el backend (/api/items).
export const getProductos = () => api.get('/items')
export const getProductoById = async (id) => {
  const productos = await api.get('/items')
  const producto = productos.find((item) => String(item.id) === String(id))
  if (!producto) throw new Error('Producto no encontrado')
  return producto
}
export const createProducto = (data) => api.post('/items', data)
export const updateProducto = (id, data) => api.put(`/items/${id}`, data)
export const deleteProducto = (id) => api.delete(`/items/${id}`)

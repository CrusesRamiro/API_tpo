import api from './api'

// El token lo inyecta el interceptor de Axios (api.js), por eso ya no se pasa.
export const obtenerCarrito = (usuarioId) => api.get(`/carrito/${usuarioId}`)

export const vaciarCarrito = (usuarioId) => api.delete(`/carrito/${usuarioId}`)

export const actualizarCantidadCarrito = (usuarioId, idItem, cant) =>
  api.put(`/carrito/${usuarioId}/itemsMod`, { idItem, cant })

export const eliminarItemCarrito = (usuarioId, itemId) =>
  api.delete(`/carrito/${usuarioId}/${itemId}`)

export const agregarItemCarrito = (usuarioId, idItem, cant) =>
  api.post(`/carrito/${usuarioId}/items`, { idItem, cant })

export const checkout = (usuarioId) =>
  api.post(`/pedidos/checkout/${usuarioId}`)
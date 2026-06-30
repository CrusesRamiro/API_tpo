import api from './api'

export const getPedidosByUsuario = (usuarioId) => api.get(`/pedidos/usuario/${usuarioId}`)
export const getAllPedidos = () => api.get('/pedidos')
export const updateEstadoPedido = (id, estado) => api.put(`/pedidos/${id}/estado`, { estado })
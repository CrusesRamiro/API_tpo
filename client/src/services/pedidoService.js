export async function getPedidosByUsuario(usuarioId, token) {
  const res = await fetch(`/api/pedidos/usuario/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Error al obtener pedidos')
  return res.json()
}

export async function getAllPedidos(token) {
  const res = await fetch('/api/pedidos', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Error al obtener pedidos')
  return res.json()
}

export async function updateEstadoPedido(id, estado, token) {
  const res = await fetch(`/api/pedidos/${id}/estado`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ estado }),
  })
  if (!res.ok) throw new Error('Error al actualizar estado')
  return res.json()
}

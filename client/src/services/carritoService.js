export async function obtenerCarrito(usuarioId, token) {
  const res = await fetch(`/api/carrito/${usuarioId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Error al obtener el carrito')
  return res.json()
}

export async function vaciarCarrito(usuarioId, token) {
  const res = await fetch(`/api/carrito/${usuarioId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Error al vaciar el carrito')
}

export async function actualizarCantidadCarrito(usuarioId, idItem, cant, token) {
  const res = await fetch(`/api/carrito/${usuarioId}/itemsMod`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ idItem, cant }),
  })
  if (!res.ok) throw new Error('Error al actualizar la cantidad del carrito')
}

export async function eliminarItemCarrito(usuarioId, itemId, token) {
  const res = await fetch(`/api/carrito/${usuarioId}/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Error al eliminar el item del carrito')
}

export async function agregarItemCarrito(usuarioId, idItem, cant, token) {
  const res = await fetch(`/api/carrito/${usuarioId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ idItem, cant }),
  })
  if (!res.ok) throw new Error('Error al agregar item al carrito')
}

export async function checkout(usuarioId, token) {
  const res = await fetch(`/api/pedidos/checkout/${usuarioId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(msg || 'Error al confirmar el pedido')
  }
  return res.json()
}

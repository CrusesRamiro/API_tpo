export async function vaciarCarrito(usuarioId, token) {
  const res = await fetch(`/api/carrito/${usuarioId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Error al vaciar el carrito')
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

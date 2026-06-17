export async function getProductos() {
  const res = await fetch('/api/items')
  if (!res.ok) throw new Error('Error al obtener productos')
  return res.json()
}

export async function getProductoById(id) {
  const res = await fetch(`/api/items/${id}`)
  if (!res.ok) throw new Error('Producto no encontrado')
  return res.json()
}

export async function createProducto(data, token) {
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear producto')
  return res.json()
}

export async function updateProducto(id, data, token) {
  const res = await fetch(`/api/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al actualizar producto')
  return res.json()
}

export async function deleteProducto(id, token) {
  const res = await fetch(`/api/items/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Error al eliminar producto')
}

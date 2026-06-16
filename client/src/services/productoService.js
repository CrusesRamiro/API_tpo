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

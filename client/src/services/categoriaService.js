export async function getCategorias() {
  const res = await fetch('/api/categorias')
  if (!res.ok) throw new Error('Error al obtener categorías')
  return res.json()
}

export async function createCategoria(data, token) {
  const res = await fetch('/api/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al crear categoría')
  return res.json()
}

export async function updateCategoria(id, data, token) {
  const res = await fetch(`/api/categorias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Error al actualizar categoría')
  return res.json()
}

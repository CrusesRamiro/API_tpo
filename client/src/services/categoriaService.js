export async function getCategorias() {
  const res = await fetch('/api/categorias')
  if (!res.ok) throw new Error('Error al obtener categorías')
  return res.json()
}

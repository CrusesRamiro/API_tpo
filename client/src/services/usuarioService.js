export async function getAllUsuarios(token) {
  const res = await fetch('/api/usuarios', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Error al obtener usuarios')
  return res.json()
}

import { useState, useEffect } from 'react'
import { getProductos } from '../services/productoService'
import { getCategorias } from '../services/categoriaService'
import SearchBar from '../components/SearchBar'
import SortSelect from '../components/SortSelect'
import CategoryFilter from '../components/CategoryFilter'
import ProductGrid from '../components/ProductGrid'

// Caché del catálogo en localStorage: se pinta al instante lo último visto y se
// revalida contra el backend en segundo plano (stale-while-revalidate).
const CATALOGO_CACHE = 'catalogo'
const loadCatalogoCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CATALOGO_CACHE))
  } catch {
    return null
  }
}

export default function ProductosView({ showToast }) {
  const cache = loadCatalogoCache()
  const [productos, setProductos] = useState(cache?.productos || [])
  const [categorias, setCategorias] = useState(cache?.categorias || [])
  const [loading, setLoading] = useState(!cache)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState(null)
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    Promise.all([getProductos(), getCategorias()])
      .then(([items, cats]) => {
        setProductos(items)
        setCategorias(cats)
        setError(null)
        localStorage.setItem(CATALOGO_CACHE, JSON.stringify({ productos: items, categorias: cats }))
      })
      // Si falla pero ya teníamos cache, no rompemos la vista: dejamos lo cacheado.
      .catch(err => { if (!cache) setError(err.message) })
      .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let filtered = productos
    .filter(p => activeCat ? p.categoria?.id === activeCat : true)
    .filter(p => {
      const q = search.toLowerCase()
      return q === '' || p.nombre.toLowerCase().includes(q) || p.descripcion?.toLowerCase().includes(q)
    })

  if (sortBy === 'precio-asc') filtered = [...filtered].sort((a, b) => a.precio - b.precio)
  if (sortBy === 'precio-desc') filtered = [...filtered].sort((a, b) => b.precio - a.precio)
  if (sortBy === 'nombre') filtered = [...filtered].sort((a, b) => a.nombre.localeCompare(b.nombre))

  return (
    <>
      <div className="page-header">
        <h1>Catálogo de Productos</h1>
        <p>Explorá nuestra colección completa</p>
      </div>

      <div className="section">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar producto..."
          />
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>

        <CategoryFilter categorias={categorias} activeCat={activeCat} onChange={setActiveCat} />

        {loading && <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando productos...</p>}
        {error && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--error, red)' }}>No se pudo conectar con el servidor: {error}</p>}
        {!loading && !error && <ProductGrid products={filtered} showToast={showToast} />}
      </div>
    </>
  )
}

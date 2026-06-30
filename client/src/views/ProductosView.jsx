import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProductos,
  selectProductos,
  selectProductosLoading,
  selectProductosError,
} from '../store/productosSlice'
import { fetchCategorias, selectCategorias } from '../store/categoriasSlice'
import SearchBar from '../components/SearchBar'
import SortSelect from '../components/SortSelect'
import CategoryFilter from '../components/CategoryFilter'
import ProductGrid from '../components/ProductGrid'

export default function ProductosView({ showToast }) {
  const dispatch = useDispatch()
  const productos = useSelector(selectProductos)
  const categorias = useSelector(selectCategorias)
  const loading = useSelector(selectProductosLoading)
  const error = useSelector(selectProductosError)

  // Estado de UI (no son datos del backend): búsqueda, filtro y orden.
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState(null)
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    dispatch(fetchProductos())
    dispatch(fetchCategorias())
  }, [dispatch])

  let filtered = productos
    .filter((p) => (activeCat ? p.categoria?.id === activeCat : true))
    .filter((p) => {
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
        {error && !loading && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--error, red)' }}>No se pudo conectar con el servidor: {error}</p>}
        {!loading && !error && <ProductGrid products={filtered} showToast={showToast} />}
      </div>
    </>
  )
}
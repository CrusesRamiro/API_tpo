import { useState } from 'react'
import { PRODUCTS } from '../data/mockData'
import SearchBar from '../components/SearchBar'
import SortSelect from '../components/SortSelect'
import CategoryFilter from '../components/CategoryFilter'
import ProductGrid from '../components/ProductGrid'

export default function ProductosView({ showToast }) {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState(null)
  const [sortBy, setSortBy] = useState('default')

  let filtered = PRODUCTS
    .filter(p => activeCat ? p.categoriaId === activeCat : true)
    .filter(p => {
      const q = search.toLowerCase()
      return q === '' || p.nombre.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q)
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

        <CategoryFilter activeCat={activeCat} onChange={setActiveCat} />

        <ProductGrid products={filtered} showToast={showToast} />
      </div>
    </>
  )
}
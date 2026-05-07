import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { PRODUCTS, CATEGORIES } from '../data/mockData'

export default function ProductosPage({ showToast }) {
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
        {/* SEARCH & SORT */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            className="form-input"
            placeholder="Buscar producto..."
            style={{ maxWidth: '320px' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '180px' }}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="default">Ordenar por…</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="nombre">Nombre A–Z</option>
          </select>
        </div>

        {/* CATEGORY TAGS */}
        <div style={{ marginBottom: '2rem' }}>
          <span className={`tag ${activeCat === null ? 'active' : ''}`} onClick={() => setActiveCat(null)}>
            Todos
          </span>
          {CATEGORIES.map(c => (
            <span
              key={c.id}
              className={`tag ${activeCat === c.id ? 'active' : ''}`}
              onClick={() => setActiveCat(c.id)}
            >
              {c.nombre}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '3rem' }}>
            No se encontraron productos.
          </p>
        ) : (
          <div className="product-grid">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} showToast={showToast} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

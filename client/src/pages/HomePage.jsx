import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { PRODUCTS, CATEGORIES } from '../data/mockData'

export default function HomePage({ showToast }) {
  const [activeCat, setActiveCat] = useState(null)
  const navigate = useNavigate()

  const featured = PRODUCTS.filter(p => p.nuevo).slice(0, 4)
  const filtered = activeCat
    ? PRODUCTS.filter(p => p.categoriaId === activeCat)
    : PRODUCTS.slice(0, 8)

  return (
    <>
      {/* HERO */}
      <div className="hero" style={{
        backgroundImage: 'url(/record-shop-interior-2-blur.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
      }} />
      <div className="hero-eyebrow" style={{ position: 'relative', zIndex: 1 }}>Nuevas llegadas 2026</div>
      <h1 style={{ position: 'relative', zIndex: 1 }}>Lo mejor en vinilos,<br /><em>a tu alcance</em></h1>
      <p style={{ position: 'relative', zIndex: 1 }}>Descubrí nuestra selección curada de vinilos: Clásicos eternos, joyas ocultas, y lanzamientos modernos</p>
      <div className="hero-cta" style={{ position: 'relative', zIndex: 1 }}>
        <button className="btn-primary" onClick={() => navigate('/productos')}>Ver catálogo</button>
        <button className="btn-outline" onClick={() => navigate('/contacto')}>Contactarnos</button>
      </div>
    </div>
      {/* FEATURED */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="section" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <div className="section-header">
            <h2 className="section-title">Novedades</h2>
            <span className="section-link" onClick={() => navigate('/productos')}>Ver todo →</span>
          </div>
          <div className="product-grid">
            {featured.map(p => (
              <ProductCard key={p.id} product={p} showToast={showToast} />
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORIAS TABS */}
      <div className="categories-bar">
        <button className={`cat-tab ${activeCat === null ? 'active' : ''}`} onClick={() => setActiveCat(null)}>
          Todos
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`cat-tab ${activeCat === c.id ? 'active' : ''}`}
            onClick={() => setActiveCat(c.id)}
          >
            {c.nombre}
          </button>
        ))}
      </div>

      {/* CATALOGO */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">
            {activeCat ? CATEGORIES.find(c => c.id === activeCat)?.nombre : 'Catálogo'}
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{filtered.length} productos</span>
        </div>
        <div className="product-grid">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} showToast={showToast} />
          ))}
        </div>
      </div>
    </>
  )
}

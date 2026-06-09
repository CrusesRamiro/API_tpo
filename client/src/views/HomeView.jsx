import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PRODUCTS } from '../data/mockData'
import CategoryTabs from '../components/CategoryTabs'
import ProductGrid from '../components/ProductGrid'

export default function HomeView({ showToast }) {
  const [activeCat, setActiveCat] = useState(null)
  const navigate = useNavigate()

  const featured = PRODUCTS.filter(p => p.nuevo).slice(0, 4)
  const filtered = activeCat
    ? PRODUCTS.filter(p => p.categoriaId === activeCat)
    : PRODUCTS.slice(0, 8)

  return (
    <>
      <div className="hero" style={{
        backgroundImage: 'url(/record-shop-interior-2-blur.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, filter: 'brightness(0.5)', backgroundImage: 'url(/record-shop-interior-2-blur.png)', backgroundSize: 'cover', backgroundPosition: 'center', transform: 'scale(1.05)' }} />
        <div className="hero-eyebrow" style={{ position: 'relative', zIndex: 1 }}>Nuevas llegadas 2026</div>
        <h1 style={{ position: 'relative', zIndex: 1 }}>Lo mejor en vinilos,<br/><em>a tu alcance</em></h1>
        <p style={{ position: 'relative', zIndex: 1 }}>Descubrí nuestra selección curada de productos premium con envío rápido y garantía extendida.</p>
        <div className="hero-cta" style={{ position: 'relative', zIndex: 1 }}>
          <button className="btn-primary" onClick={() => navigate('/productos')}>Ver catálogo</button>
          <button className="btn-outline" onClick={() => navigate('/contacto')}>Contactarnos</button>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="section" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <div className="section-header">
            <h2 className="section-title">Novedades</h2>
            <span className="section-link" onClick={() => navigate('/productos')}>Ver todo →</span>
          </div>
          <ProductGrid products={featured} showToast={showToast} />
        </div>
      </div>

      <CategoryTabs activeCat={activeCat} onChange={setActiveCat} />

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Catálogo</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{filtered.length} productos</span>
        </div>
        <ProductGrid products={filtered} showToast={showToast} />
      </div>
    </>
  )
}
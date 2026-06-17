import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductos } from '../services/productoService'
import { getCategorias } from '../services/categoriaService'
import CategoryTabs from '../components/CategoryTabs'
import ProductGrid from '../components/ProductGrid'

export default function HomeView({ showToast }) {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [activeCat, setActiveCat] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([getProductos(), getCategorias()])
      .then(([items, cats]) => {
        setProductos(items)
        setCategorias(cats)
      })
      .finally(() => setLoading(false))
  }, [])

  const featured = productos.slice(0, 4)
  const filtered = activeCat
    ? productos.filter(p => p.categoria?.id === activeCat)
    : productos.slice(0, 8)

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
          {loading
            ? <p style={{ color: 'var(--text3)' }}>Cargando...</p>
            : <ProductGrid products={featured} showToast={showToast} />
          }
        </div>
      </div>

      <CategoryTabs categorias={categorias} activeCat={activeCat} onChange={setActiveCat} />

      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Catálogo</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>{filtered.length} productos</span>
        </div>
        {loading
          ? <p style={{ color: 'var(--text3)' }}>Cargando...</p>
          : <ProductGrid products={filtered} showToast={showToast} />
        }
      </div>
    </>
  )
}

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'
import { getProductoById } from '../services/productoService'
import QuantityControl from '../components/QuantityControl'

function getImageSrc(base64) {
  if (!base64) return null
  if (base64.startsWith('/9j/')) return `data:image/jpeg;base64,${base64}`
  if (base64.startsWith('iVBORw')) return `data:image/png;base64,${base64}`
  return `data:image/jpeg;base64,${base64}`
}

export default function DetalleView({ showToast }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [qty, setQty] = useState(1)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProductoById(id)
      .then(setProduct)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="section" style={{ textAlign: 'center', paddingTop: '4rem' }}>Cargando...</div>

  if (error || !product) {
    return (
      <div className="section" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: 'var(--text3)', marginBottom: '1rem' }}>Producto no encontrado.</p>
        <button className="btn-primary" onClick={() => navigate('/productos')}>Ver catálogo</button>
      </div>
    )
  }

  const imageSrc = getImageSrc(product.fotos?.[0]?.imagen)

  function handleAddToCart() {
    dispatch(addToCart(product, qty))
    showToast(`${product.nombre} x ${qty} agregado al carrito`)
  }

  return (
    <div className="detail-page">
      <div>
        <div className="detail-gallery">
          {imageSrc ? (
            <img src={imageSrc} alt={product.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 'var(--radius)' }} />
          ) : (
            <div style={{ fontSize: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>💽</div>
          )}
        </div>
      </div>

      <div className="detail-info">
        <div className="detail-breadcrumb">
          <Link to="/">Inicio</Link>
          {' / '}
          <Link to="/productos">Productos</Link>
          {' / '}
          <span style={{ color: 'var(--text)' }}>{product.nombre}</span>
        </div>

        <div className="detail-cat">{product.categoria?.nombre}</div>
        <h1 className="detail-title">{product.nombre}</h1>

        <div className="detail-price">
          ${product.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </div>

        <p className="detail-desc">{product.descripcion}</p>

        <div className="stock-info">
          <div className="stock-dot" style={{ background: product.stock > 5 ? '#22c55e' : '#f59e0b' }} />
          <span style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
            {product.stock > 5 ? 'En stock' : `Solo ${product.stock} disponibles`}
          </span>
        </div>

        <div className="qty-row">
          <QuantityControl qty={qty} setQty={setQty} max={product.stock} />
          <button className="btn-add-detail" onClick={handleAddToCart}>
            Agregar al carrito
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text3)', lineHeight: 1.6 }}>
            Incluye envío gratis a partir de $100, devolución gratuita, y garantía de 12 meses
          </p>
        </div>
      </div>
    </div>
  )
}

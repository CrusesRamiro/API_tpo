import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { PRODUCTS, CATEGORIES } from '../data/mockData'

export default function DetallePage({ showToast }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)

  const product = PRODUCTS.find(p => p.id === Number(id))

  if (!product) {
    return (
      <div className="section" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: 'var(--text3)', marginBottom: '1rem' }}>Producto no encontrado.</p>
        <button className="btn-primary" onClick={() => navigate('/productos')}>Ver catálogo</button>
      </div>
    )
  }

  const categoria = CATEGORIES.find(c => c.id === product.categoriaId)

  function handleAddToCart() {
    addToCart(product, qty)
    showToast(`${product.nombre} x ${qty} agregado al carrito`)
  }

  return (
    <div className="detail-page">
      {/* GALLERY */}
      <div>
        <div className="detail-gallery">
        {product.imagen ? (
          <img src={product.imagen} alt={product.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 'var(--radius)' }} />
        ) : (
          product.emoji
        )}
        </div>
      </div>

      {/* INFO */}
      <div className="detail-info">
        <div className="detail-breadcrumb">
          <Link to="/">Inicio</Link>
          {' / '}
          <Link to="/productos">Productos</Link>
          {' / '}
          <span style={{ color: 'var(--text)' }}>{product.nombre}</span>
        </div>

        <div className="detail-cat">{categoria?.nombre}</div>
        <h1 className="detail-title">{product.nombre}</h1>

        {product.nuevo && (
          <span style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '20px', alignSelf: 'flex-start' }}>
            Nuevo
          </span>
        )}

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

        {/* QUANTITY + ADD TO CART */}
        <div className="qty-row">
          <div className="qty-control">
            <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
            <span className="qty-val">{qty}</span>
            <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
          </div>
          <button className="btn-add-detail" onClick={handleAddToCart}>
            Agregar al carrito
          </button>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <p style={{ fontSize: '0.82rem', color: 'var(--text3)', lineHeight: 1.6 }}>
            ✓ Envío gratis a partir de $100 · ✓ Devolución gratuita · ✓ Garantía 12 meses
          </p>
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { CATEGORIES } from '../data/mockData'

export default function ProductCard({ product, showToast }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()

  function handleAddToCart(e) {
    e.stopPropagation()
    addToCart(product)
    showToast(`${product.nombre} agregado al carrito`)
  }

  const categoria = CATEGORIES.find(c => c.id === product.categoriaId)

  return (
    <div className="product-card" onClick={() => navigate(`/detalle/${product.id}`)}>
      <div className="product-img">
        {product.imagen ? (
          <img
            src={product.imagen}
            alt={product.nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          ) : (
            <div className="product-img-placeholder">{product.emoji}</div>
          )}
        {product.nuevo && <span className="product-badge">Nuevo</span>}
      </div>
      <div className="product-info">
        <div className="product-cat">{categoria?.nombre}</div>
        <div className="product-name">{product.nombre}</div>
        <div className="product-desc">{product.descripcion}</div>
        <div className="product-footer">
          <div className="product-price">
            ${product.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </div>
          <button className="add-to-cart" onClick={handleAddToCart}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

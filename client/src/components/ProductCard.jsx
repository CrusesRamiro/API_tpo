import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

function getImageSrc(base64) {
  if (!base64) return null
  if (base64.startsWith('/9j/')) return `data:image/jpeg;base64,${base64}`
  if (base64.startsWith('iVBORw')) return `data:image/png;base64,${base64}`
  return `data:image/jpeg;base64,${base64}`
}

export default function ProductCard({ product, showToast }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  function handleAddToCart(e) {
    e.stopPropagation()
    dispatch(addToCart(product))
    showToast(`${product.nombre} agregado al carrito`)
  }

  const imageSrc = getImageSrc(product.fotos?.[0]?.imagen)
  const categoria = product.categoria?.nombre

  return (
    <div className="product-card" onClick={() => navigate(`/detalle/${product.id}`)}>
      <div className="product-img">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="product-img-placeholder">💽</div>
        )}
      </div>
      <div className="product-info">
        <div className="product-cat">{categoria}</div>
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

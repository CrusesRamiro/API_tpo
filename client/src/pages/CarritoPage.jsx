import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../data/mockData'

export default function CarritoPage({ showToast }) {
  const { cart, updateQty, removeItem, clearCart } = useCart()
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const subtotal = cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  const envio = subtotal > 0 ? (subtotal >= 100 ? 0 : 9.99) : 0
  const total = subtotal + envio

  function handleCheckout() {
  if (!isLoggedIn) { navigate('/login'); return }
  navigate('/pago')
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <svg viewBox="0 0 24 24">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Tu carrito está vacío
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>Explorá nuestro catálogo para agregar productos.</p>
        <button className="btn-primary" onClick={() => navigate('/productos')}>Ir al catálogo</button>
      </div>
    )
  }

  return (
    <>
      <div className="page-header">
        <h1>Mi Carrito</h1>
        <p>{cart.length} {cart.length === 1 ? 'producto' : 'productos'}</p>
      </div>

      <div className="cart-layout">
        {/* ITEMS */}
        <div className="cart-items">
          {cart.map(item => {
            const cat = CATEGORIES.find(c => c.id === item.categoriaId)
            return (
              <div className="cart-item" key={item.id}>
                  <div className="cart-item-img">
                  {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    item.emoji
                  )}
                  </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.nombre}</div>
                  <div className="cart-item-cat">{cat?.nombre}</div>
                  <div className="qty-control" style={{ width: 'fit-content', marginTop: '0.25rem' }}>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.cantidad - 1)}>−</button>
                    <span className="qty-val">{item.cantidad}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, item.cantidad + 1)}>+</button>
                  </div>
                </div>
                <div className="cart-item-price">
                  ${(item.precio * item.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
              </div>
            )
          })}
        </div>

        {/* SUMMARY */}
        <div className="cart-summary">
          <h3>Resumen del pedido</h3>
          {cart.map(item => (
            <div className="summary-row" key={item.id}>
              <span>{item.nombre} x {item.cantidad}</span>
              <span>${(item.precio * item.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Envío</span>
            <span>{envio === 0 ? 'Gratis' : `$${envio.toFixed(2)}`}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            {isLoggedIn ? 'Finalizar compra' : 'Iniciar sesión para comprar'}
          </button>
        </div>
      </div>
    </>
  )
}

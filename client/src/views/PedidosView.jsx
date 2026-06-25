import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser, selectIsLoggedIn } from '../store/authSlice'
import { getPedidosByUsuario } from '../services/pedidoService'

export default function PedidosView() {
  const user = useSelector(selectUser)
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openId, setOpenId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) { setLoading(false); return }
    getPedidosByUsuario(user.id, user.token)
      .then(setPedidos)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [isLoggedIn, user])

  if (!isLoggedIn) {
    return (
      <div className="section" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <p style={{ color: 'var(--text3)', marginBottom: '1rem' }}>Iniciá sesión para ver tus pedidos.</p>
        <button className="btn-primary" onClick={() => navigate('/login')}>Iniciar sesión</button>
      </div>
    )
  }

  if (loading) return <div className="section" style={{ textAlign: 'center', paddingTop: '4rem' }}>Cargando pedidos...</div>

  if (error) return <div className="section" style={{ textAlign: 'center', paddingTop: '4rem', color: 'var(--error, red)' }}>{error}</div>

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1.5rem' }}>
        Mis Pedidos
      </h1>

      {pedidos.length === 0 && (
        <p style={{ color: 'var(--text3)' }}>Todavía no tenés pedidos realizados.</p>
      )}

      {pedidos.map(order => (
        <div className="order-card" key={order.id}>
          <div className="order-header" onClick={() => setOpenId(openId === order.id ? null : order.id)}>
            <div>
              <div className="order-id">Pedido #{order.id}</div>
              <div className="order-date">
                {new Date(order.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <span className={`order-status status-${order.estado}`}>{order.estado}</span>
            <div style={{ fontWeight: 500 }}>
              ${order.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </div>
            <span style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>
              {openId === order.id ? '▲' : '▼'}
            </span>
          </div>

          {openId === order.id && (
            <div className="order-body">
              {order.detalle.map((d, i) => (
                <div className="order-detail-item" key={i}>
                  <span>{d.item.nombre} x {d.cantidad}</span>
                  <span>${(d.precioUnidad * d.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

import { useState } from 'react'
import { ORDERS_MOCK } from '../data/mockData'

export default function PedidosPage() {
  const [openId, setOpenId] = useState(null)

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1.5rem' }}>
        Mis Pedidos
      </h1>

      {ORDERS_MOCK.map(order => (
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
                  <span>${(d.item.precio * d.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

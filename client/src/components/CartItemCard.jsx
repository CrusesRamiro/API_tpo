import QuantityControl from './QuantityControl'

export default function CartItemCard({ item, updateQty, removeItem }) {
  const imageSrc = item.fotos?.[0]?.imagen
    ? item.fotos[0].imagen.startsWith('/9j/')
      ? `data:image/jpeg;base64,${item.fotos[0].imagen}`
      : `data:image/png;base64,${item.fotos[0].imagen}`
    : null

  return (
    <div className="cart-item">
      <div className="cart-item-img">
        {imageSrc
          ? <img src={imageSrc} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
          : <span style={{ fontSize: '2rem' }}>💽</span>
        }
      </div>
      <div className="cart-item-info">
        <div className="cart-item-name">{item.nombre}</div>
        <div className="cart-item-cat">{item.categoria?.nombre}</div>
        <QuantityControl
          qty={item.cantidad}
          setQty={qty => {
            if (qty === 0) removeItem(item.id)
            else updateQty(item.id, qty)
          }}
          max={item.stock || 99}
        />
      </div>
      <div className="cart-item-price">
        ${(item.precio * item.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
      </div>
      <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
    </div>
  )
}

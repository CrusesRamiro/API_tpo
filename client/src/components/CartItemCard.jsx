import { CATEGORIES } from '../data/mockData'
import QuantityControl from './QuantityControl'

export default function CartItemCard({ item, updateQty, removeItem }) {
  const cat = CATEGORIES.find(c => c.id === item.categoriaId)

  return (
    <div className="cart-item">
      <div className="cart-item-img">
        {item.imagen
          ? <img src={item.imagen} alt={item.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
          : item.emoji
        }
      </div>
      <div className="cart-item-info">
        <div className="cart-item-name">{item.nombre}</div>
        <div className="cart-item-cat">{cat?.nombre}</div>
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
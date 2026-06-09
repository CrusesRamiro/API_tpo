export default function QuantityControl({ qty, setQty, max }) {
  return (
    <div className="qty-control">
      <button className="qty-btn" onClick={() => setQty(Math.max(0, qty - 1))}>−</button>
      <span className="qty-val">{qty}</span>
      <button className="qty-btn" onClick={() => setQty(Math.min(max, qty + 1))}>+</button>
    </div>
  )
}
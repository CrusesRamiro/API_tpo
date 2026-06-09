import ProductCard from './ProductCard'

export default function ProductGrid({ products, showToast }) {
  if (products.length === 0) {
    return (
      <p style={{ color: 'var(--text3)', textAlign: 'center', padding: '3rem' }}>
        No se encontraron productos.
      </p>
    )
  }
  return (
    <div className="product-grid">
      {products.map(p => (
        <ProductCard key={p.id} product={p} showToast={showToast} />
      ))}
    </div>
  )
}
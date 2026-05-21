import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { precioFinal } from '../data/mockData'

const METODOS = [
  { id: 'tarjeta', label: 'Tarjeta de crédito / débito', icono: '💳' },
  { id: 'transferencia', label: 'Transferencia bancaria', icono: '🏦' },
  { id: 'efectivo', label: 'Efectivo / Rapipago', icono: '💵' },
]

export default function PagoPage({ showToast }) {
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const [metodo, setMetodo] = useState('tarjeta')
  const [form, setForm] = useState({ numero: '', nombre: '', vencimiento: '', cvv: '', cbu: '', alias: '' })
  const [errors, setErrors] = useState({})

  const total = cart.reduce((acc, i) => acc + precioFinal(i) * i.cantidad, 0)

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }))
  }

  function validate() {
    const e = {}
    if (metodo === 'tarjeta') {
      if (!form.numero || form.numero.replace(/\s/g, '').length < 16) e.numero = 'Número inválido'
      if (!form.nombre.trim()) e.nombre = 'Requerido'
      if (!form.vencimiento) e.vencimiento = 'Requerido'
      if (!form.cvv || form.cvv.length < 3) e.cvv = 'CVV inválido'
    }
    if (metodo === 'transferencia') {
      if (!form.cbu && !form.alias) e.cbu = 'Ingresá CBU o alias'
    }
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    clearCart()
    showToast('¡Pago confirmado!')
    navigate('/pedidos')
  }

  if (cart.length === 0) {
    navigate('/carrito')
    return null
  }

  return (
    <>
      <div className="page-header">
        <h1>Finalizar compra</h1>
        <p>Elegí tu método de pago</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', padding: '2.5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* FORMULARIO */}
        <div>
          {/* SELECTOR DE MÉTODO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {METODOS.map(m => (
              <div
                key={m.id}
                onClick={() => setMetodo(m.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1rem 1.25rem', borderRadius: 'var(--radius)',
                  border: `2px solid ${metodo === m.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: metodo === m.id ? 'rgba(233,69,96,0.04)' : 'var(--surface)',
                  cursor: 'pointer', transition: 'all 0.18s'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{m.icono}</span>
                <span style={{ fontWeight: metodo === m.id ? 500 : 400 }}>{m.label}</span>
                <div style={{
                  marginLeft: 'auto', width: '18px', height: '18px', borderRadius: '50%',
                  border: `2px solid ${metodo === m.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: metodo === m.id ? 'var(--accent)' : 'transparent',
                  transition: 'all 0.18s'
                }} />
              </div>
            ))}
          </div>

          {/* CAMPOS TARJETA */}
          {metodo === 'tarjeta' && (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Número de tarjeta</label>
                <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19}
                  value={form.numero}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                    const fmt = val.match(/.{1,4}/g)?.join(' ') || val
                    handleChange('numero', fmt)
                  }}
                />
                {errors.numero && <span className="field-error">{errors.numero}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Nombre en la tarjeta</label>
                <input className="form-input" placeholder="Como figura en la tarjeta"
                  value={form.nombre} onChange={e => handleChange('nombre', e.target.value)} />
                {errors.nombre && <span className="field-error">{errors.nombre}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Vencimiento</label>
                  <input className="form-input" placeholder="MM/AA" maxLength={5}
                    value={form.vencimiento}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                      const fmt = val.length > 2 ? val.slice(0,2) + '/' + val.slice(2) : val
                      handleChange('vencimiento', fmt)
                    }}
                  />
                  {errors.vencimiento && <span className="field-error">{errors.vencimiento}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input className="form-input" placeholder="123" maxLength={4}
                    value={form.cvv} onChange={e => handleChange('cvv', e.target.value.replace(/\D/g, ''))} />
                  {errors.cvv && <span className="field-error">{errors.cvv}</span>}
                </div>
              </div>
              <button type="submit" className="form-submit" style={{ width: '100%', marginTop: '0.5rem' }}>
                Confirmar pago ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </button>
            </form>
          )}

          {/* CAMPOS TRANSFERENCIA */}
          {metodo === 'transferencia' && (
            <form onSubmit={handleSubmit}>
              <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                <p><strong style={{ color: 'var(--text)' }}>Datos bancarios:</strong></p>
                <p>CBU: 0000003100012345678901</p>
                <p>Alias: RESONICA.PAGOS</p>
                <p>Titular: Resonica S.A.</p>
              </div>
              <div className="form-group">
                <label className="form-label">Tu CBU o alias (para confirmar)</label>
                <input className="form-input" placeholder="Tu CBU o alias"
                  value={form.cbu} onChange={e => handleChange('cbu', e.target.value)} />
                {errors.cbu && <span className="field-error">{errors.cbu}</span>}
              </div>
              <button type="submit" className="form-submit" style={{ width: '100%' }}>
                Confirmar transferencia
              </button>
            </form>
          )}

          {/* EFECTIVO */}
          {metodo === 'efectivo' && (
            <form onSubmit={handleSubmit}>
              <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                <p><strong style={{ color: 'var(--text)' }}>Instrucciones:</strong></p>
                <p>1. Hacé click en "Generar código de pago"</p>
                <p>2. Llevá el código a cualquier Rapipago o Pago Fácil</p>
                <p>3. Tu pedido se confirma automáticamente al acreditarse</p>
              </div>
              <button type="submit" className="form-submit" style={{ width: '100%' }}>
                Generar código de pago
              </button>
            </form>
          )}
        </div>

        {/* RESUMEN */}
        <div className="cart-summary">
          <h3>Resumen</h3>
          {cart.map(item => (
            <div className="summary-row" key={item.id}>
              <span>{item.nombre} × {item.cantidad}</span>
              <span>${(precioFinal(item) * item.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </>
  )
}
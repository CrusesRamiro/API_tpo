import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectCartItems,
  checkoutCart,
  resetCheckout,
  selectCheckoutStatus,
  selectCheckoutError,
} from '../store/cartSlice'

const METODOS = [
  { id: 'tarjeta', label: 'Tarjeta de crédito / débito', icono: '💳' },
  { id: 'transferencia', label: 'Transferencia bancaria', icono: '🏦' },
  { id: 'efectivo', label: 'Efectivo / Rapipago', icono: '💵' },
]

export default function PagoView({ showToast }) {
  const cart = useSelector(selectCartItems)
  const checkoutStatus = useSelector(selectCheckoutStatus)
  const checkoutError = useSelector(selectCheckoutError)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [metodo, setMetodo] = useState('tarjeta')
  const [form, setForm] = useState({ numero: '', nombre: '', vencimiento: '', cvv: '', cbu: '', alias: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const loading = checkoutStatus === 'loading'

  const total = cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

  // Reaccionamos al resultado del checkout leyendo el estado del slice.
  useEffect(() => {
    if (!submitted) return
    if (checkoutStatus === 'succeeded') {
      showToast('¡Pago confirmado!')
      dispatch(resetCheckout())
      navigate('/pedidos')
    }
    if (checkoutStatus === 'failed') {
      showToast('Error: ' + checkoutError)
      dispatch(resetCheckout())
      setSubmitted(false)
    }
  }, [submitted, checkoutStatus, checkoutError, dispatch, navigate, showToast])

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }))
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
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSubmitted(true)
    dispatch(checkoutCart())
  }

  // Mientras no se haya confirmado el pago, un carrito vacío manda al carrito.
  if (cart.length === 0 && !submitted) {
    navigate('/carrito')
    return null
  }

  function detectarTarjeta(numero) {
    const n = numero.replace(/\s/g, '')
    if (n.startsWith('4')) return 'Visa'
    if (/^5[1-5]/.test(n) || /^2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720)/.test(n)) return 'Mastercard'
    return null
  }

  const tipoTarjeta = detectarTarjeta(form.numero)
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
            {METODOS.map((m) => (
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
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-input"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={form.numero}
                    style={{ paddingRight: tipoTarjeta ? '110px' : '1rem' }}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 16)
                      const fmt = val.match(/.{1,4}/g)?.join(' ') || val
                      handleChange('numero', fmt)
                    }}
                  />
                  {tipoTarjeta && (
                    <img
                      src={tipoTarjeta === 'Visa' ? '/visa-logo.svg' : '/mastercard-logo.svg'}
                      alt={tipoTarjeta}
                      style={{
                        position: 'absolute', right: '0.75rem', top: '50%',
                        transform: 'translateY(-50%)',
                        height: '24px', width: 'auto'
                      }}
                    />
                  )}
                </div>
                {errors.numero && <span className="field-error">{errors.numero}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Nombre en la tarjeta</label>
                <input className="form-input" placeholder="Como figura en la tarjeta"
                  value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
                {errors.nombre && <span className="field-error">{errors.nombre}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Vencimiento</label>
                  <input
                    className="form-input"
                    placeholder="MM/AA"
                    maxLength={5}
                    value={form.vencimiento}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 4)
                      if (val.length >= 1) {
                        const primerDigito = parseInt(val[0])
                        if (primerDigito > 1) return
                      }
                      if (val.length >= 2) {
                        const mes = parseInt(val.slice(0, 2))
                        if (mes > 12 || mes === 0) return
                      }
                      const fmt = val.length > 2 ? val.slice(0, 2) + '/' + val.slice(2) : val
                      handleChange('vencimiento', fmt)
                    }}
                  />
                  {errors.vencimiento && <span className="field-error">{errors.vencimiento}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input className="form-input" placeholder="123" maxLength={3}
                    value={form.cvv} onChange={(e) => handleChange('cvv', e.target.value.replace(/\D/g, ''))} />
                  {errors.cvv && <span className="field-error">{errors.cvv}</span>}
                </div>
              </div>
              <button type="submit" className="form-submit" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                {loading ? 'Procesando...' : `Confirmar pago $${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`}
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
                  value={form.cbu} onChange={(e) => handleChange('cbu', e.target.value)} />
                {errors.cbu && <span className="field-error">{errors.cbu}</span>}
              </div>
              <button type="submit" className="form-submit" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Procesando...' : 'Confirmar transferencia'}
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
              <button type="submit" className="form-submit" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Procesando...' : 'Generar código de pago'}
              </button>
            </form>
          )}
        </div>

        {/* RESUMEN */}
        <div className="cart-summary">
          <h3>Resumen</h3>
          {cart.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>{item.nombre} x {item.cantidad}</span>
              <span>${(item.precio * item.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
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
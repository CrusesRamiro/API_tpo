import { useState } from 'react'

const initialForm = { nombre: '', email: '', asunto: '', mensaje: '' }

export default function ContactoView({ showToast }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  function validate() {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.mensaje.trim()) e.mensaje = 'El mensaje es requerido'
    return e
  }

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSent(true)
    showToast('Mensaje enviado correctamente')
  }

  if (sent) return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✉️</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
        ¡Mensaje enviado!
      </h1>
      <p style={{ color: 'var(--text2)', marginBottom: '2rem' }}>
        Te responderemos a la brevedad a <strong>{form.email}</strong>
      </p>
      <button className="btn-primary" onClick={() => { setSent(false); setForm(initialForm) }}>
        Enviar otro mensaje
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', marginBottom: '0.5rem' }}>Contacto</h1>
      <p style={{ color: 'var(--text2)', marginBottom: '2.5rem' }}>
        ¿Tenés alguna consulta? Escribinos y te respondemos en 24hs.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="form-input" placeholder="Tu nombre" value={form.nombre} onChange={e => handleChange('nombre', e.target.value)} />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" placeholder="tucorreo@email.com" value={form.email} onChange={e => handleChange('email', e.target.value)} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Asunto</label>
          <input className="form-input" placeholder="¿En qué podemos ayudarte?" value={form.asunto} onChange={e => handleChange('asunto', e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Mensaje *</label>
          <textarea className="form-textarea" placeholder="Escribí tu mensaje aquí..." value={form.mensaje} onChange={e => handleChange('mensaje', e.target.value)} />
          {errors.mensaje && <span className="field-error">{errors.mensaje}</span>}
        </div>

        <button type="submit" className="form-submit">Enviar mensaje</button>
      </form>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as apiRegister } from '../services/authService'

const initialForm = { username: '', nombre: '', apellido: '', email: '', password: '', password2: '' }

export default function RegistroView({ showToast }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function validate() {
    const e = {}
    if (!form.username.trim()) e.username = 'Requerido'
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    if (form.password !== form.password2) e.password2 = 'Las contraseñas no coinciden'
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

    setLoading(true)
    apiRegister({
      username: form.username,
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      password: form.password,
      rolId: 2,
    })
      .then(() => {
        showToast(`Cuenta creada. Iniciá sesión, ${form.nombre}!`)
        navigate('/login')
      })
      .catch(err => setErrors({ general: err.message }))
      .finally(() => setLoading(false))
  }

  function field(name, label, type = 'text', placeholder = '') {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        <input
          className="form-input"
          type={type}
          placeholder={placeholder}
          value={form[name]}
          onChange={e => handleChange(name, e.target.value)}
        />
        {errors[name] && <span className="field-error">{errors[name]}</span>}
      </div>
    )
  }

  return (
    <div className="auth-page" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <h2>Crear cuenta</h2>
        <p className="auth-sub">Completá tus datos para registrarte.</p>

        {errors.general && <div className="auth-error">{errors.general}</div>}

        <form onSubmit={handleSubmit}>
          {field('username', 'Usuario', 'text', 'Nombre de usuario')}
          <div className="form-row">
            {field('nombre', 'Nombre', 'text', 'Juan')}
            {field('apellido', 'Apellido', 'text', 'Pérez')}
          </div>
          {field('email', 'Email', 'email', 'tucorreo@email.com')}
          {field('password', 'Contraseña', 'password', '••••••••')}
          {field('password2', 'Confirmar contraseña', 'password', '••••••••')}
          <button type="submit" className="form-submit" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <div className="auth-switch">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </div>
      </div>
    </div>
  )
}

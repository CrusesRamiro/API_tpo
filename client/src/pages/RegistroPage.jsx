import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const initialForm = { username: '', nombre: '', apellido: '', email: '', password: '', password2: '' }

export default function RegistroPage({ showToast }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
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
    // Mock register — aca reemplazar con POST /usuarios cuando hagamos integracion backend
    login({ id: 99, username: form.username, rol: 'ROLE_USER' })
    showToast(`Cuenta creada. Bienvenido, ${form.nombre}!`)
    navigate('/')
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

        <form onSubmit={handleSubmit}>
          {field('username', 'Usuario', 'text', 'Nombre de usuario')}
          <div className="form-row">
            {field('nombre', 'Nombre', 'text', 'Juan')}
            {field('apellido', 'Apellido', 'text', 'Pérez')}
          </div>
          {field('email', 'Email', 'email', 'tucorreo@email.com')}
          {field('password', 'Contraseña', 'password', '••••••••')}
          {field('password2', 'Confirmar contraseña', 'password', '••••••••')}
          <button type="submit" className="form-submit" style={{ width: '100%', marginTop: '0.5rem' }}>
            Crear cuenta
          </button>
        </form>

        <div className="auth-switch">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as apiLogin } from '../services/authService'

export default function LoginView({ showToast }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.username || !form.password) { setError('Completá todos los campos.'); return }

    setLoading(true)
    apiLogin(form.username, form.password)
      .then(data => {
        login({ id: data.userId, username: data.username, rol: data.rol, token: data.token })
        showToast(`Bienvenido, ${data.username}`)
        navigate('/')
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Iniciar sesión</h2>
        <p className="auth-sub">Accedé a tu cuenta para gestionar tus pedidos.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <input
              className="form-input"
              placeholder="Nombre de usuario"
              value={form.username}
              onChange={e => { setForm(f => ({ ...f, username: e.target.value })); setError('') }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError('') }}
            />
          </div>
          <button type="submit" className="form-submit" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="auth-switch">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </div>
      </div>
    </div>
  )
}

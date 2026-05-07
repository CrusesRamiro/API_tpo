import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage({ showToast }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.username || !form.password) { setError('Completá todos los campos.'); return }

    // Mock login — reemplazar con llamada real a /auth/login
    if (form.username === 'admin' && form.password === 'admin123') {
      login({ id: 1, username: 'admin', rol: 'ROLE_ADMIN' })
      showToast('Bienvenido, admin')
      navigate('/')
    } else if (form.username === 'user1' && form.password === 'user123') {
      login({ id: 2, username: 'user1', rol: 'ROLE_USER' })
      showToast('Bienvenido, user1')
      navigate('/')
    } else {
      setError('Usuario o contraseña incorrectos.')
    }
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
              placeholder="admin o user1"
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
          <button type="submit" className="form-submit" style={{ width: '100%', marginTop: '0.5rem' }}>
            Ingresar
          </button>
        </form>

        <p className="auth-hint">Demo: admin/admin123 · user1/user123</p>
        <div className="auth-switch">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </div>
      </div>
    </div>
  )
}

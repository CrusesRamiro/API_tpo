import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, clearError, selectAuthStatus, selectAuthError } from '../store/authSlice'

export default function LoginView({ showToast }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [formError, setFormError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(selectAuthStatus) === 'loading'
  const authError = useSelector(selectAuthError)
  const error = formError || authError

  function clearErrors() {
    setFormError('')
    dispatch(clearError())
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.username || !form.password) { setFormError('Completá todos los campos.'); return }

    dispatch(loginUser(form))
      .unwrap()
      .then(data => {
        showToast(`Bienvenido, ${data.username}`)
        navigate('/')
      })
      .catch(() => { /* el error queda en el slice (selectAuthError) */ })
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
              onChange={e => { setForm(f => ({ ...f, username: e.target.value })); clearErrors() }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => { setForm(f => ({ ...f, password: e.target.value })); clearErrors() }}
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

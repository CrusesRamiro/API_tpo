import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  loginUser,
  clearError,
  selectUser,
  selectAuthStatus,
  selectAuthError,
} from '../store/authSlice'
import { fetchAndMergeCart } from '../store/cartSlice'

export default function LoginView({ showToast }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(false) // distingue un login propio de una sesión ya activa
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const status = useSelector(selectAuthStatus)
  const user = useSelector(selectUser)
  const authError = useSelector(selectAuthError)
  const loading = status === 'loading'
  const error = formError || authError

  // Reaccionamos al resultado del thunk leyendo el estado (no .then/.catch).
  // El error de credenciales ya quedó en el slice y lo loguea el middleware.
  useEffect(() => {
    if (!submitted) return
    if (status === 'succeeded' && user) {
      dispatch(fetchAndMergeCart())
      showToast(`Bienvenido, ${user.username}`)
      navigate('/')
    }
    if (status === 'failed') setSubmitted(false)
  }, [submitted, status, user, dispatch, navigate, showToast])

  function clearErrors() {
    setFormError('')
    dispatch(clearError())
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.username || !form.password) {
      setFormError('Completá todos los campos.')
      return
    }
    setSubmitted(true)
    dispatch(loginUser(form))
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
              onChange={(e) => { setForm((f) => ({ ...f, username: e.target.value })); clearErrors() }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => { setForm((f) => ({ ...f, password: e.target.value })); clearErrors() }}
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
import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ showToast }) {
  const { cartCount } = useCart()
  const { isLoggedIn, logout, user } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    showToast('Sesión cerrada')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">
        Resonica<span>.</span>
      </NavLink>

      <ul className="nav-links" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        <li><NavLink to="/" end>Inicio</NavLink></li>
        <li><NavLink to="/productos">Productos</NavLink></li>
        <li><NavLink to="/contacto">Contacto</NavLink></li>
        {isLoggedIn && <li><NavLink to="/pedidos">Mis Pedidos</NavLink></li>}
      </ul>

      <div className="nav-right">
        <button className="cart-btn" onClick={() => navigate('/carrito')}>
          <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        {isLoggedIn ? (
          <button className="nav-user-btn" onClick={handleLogout}>
            {user?.username} · Salir
          </button>
        ) : (
          <button className="nav-user-btn" onClick={() => navigate('/login')}>
            Ingresar
          </button>
        )}
      </div>
    </nav>
  )
}

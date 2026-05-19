import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar({ showToast }) {
  const { cartCount } = useCart()
  const { isLoggedIn, logout, user } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    showToast('Sesión cerrada')
    navigate('/')
  }
  const [darkMode, setDarkMode] = useState(false)

  function toggleDark() {
    setDarkMode(d => !d)
    document.body.classList.toggle('dark')
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
        <div className="darkThemeBtn">
          <input
            type="checkbox"
            id="darkToggle"
            checked={darkMode}
            onChange={toggleDark}
          />
          <label htmlFor="darkToggle">
          <svg className="sun" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="2" x2="12" y2="4"/>
            <line x1="12" y1="20" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="4" y2="12"/>
            <line x1="20" y1="12" x2="22" y2="12"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>          
        <svg className="moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </label>
        </div>

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

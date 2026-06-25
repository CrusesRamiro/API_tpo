import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { selectDarkMode } from './store/themeSlice'
import { useToast } from './hooks/useToast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import HomeView from './views/HomeView'
import ProductosView from './views/ProductosView'
import DetalleView from './views/DetalleView'
import CarritoView from './views/CarritoView'
import ContactoView from './views/ContactoView'
import PedidosView from './views/PedidosView'
import LoginView from './views/LoginView'
import RegistroView from './views/RegistroView'
import PagoView from './views/PagoView'
import AdminView from './views/AdminView'

function AppContent() {
  const { toast, showToast } = useToast()
  const darkMode = useSelector(selectDarkMode)

  return (
    <div className={`app-wrapper ${darkMode ? 'dark' : ''}`}>
      <Navbar showToast={showToast} />
      <main>
        <Routes>
          <Route path="/"           element={<HomeView      showToast={showToast} />} />
          <Route path="/productos"  element={<ProductosView showToast={showToast} />} />
          <Route path="/detalle/:id" element={<DetalleView  showToast={showToast} />} />
          <Route path="/carrito"    element={<CarritoView   showToast={showToast} />} />
          <Route path="/contacto"   element={<ContactoView  showToast={showToast} />} />
          <Route path="/pedidos"    element={<PedidosView />} />
          <Route path="/login"      element={<LoginView     showToast={showToast} />} />
          <Route path="/registro"   element={<RegistroView  showToast={showToast} />} />
          <Route path="/pago" element={<PagoView showToast={showToast} />} />
          <Route path="/admin" element={<AdminView showToast={showToast} />} />
        </Routes>
      </main>
      <Footer />
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  )
}
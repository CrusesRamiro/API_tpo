import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { useToast } from './hooks/useToast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import HomePage from './pages/HomePage'
import ProductosPage from './pages/ProductosPage'
import DetallePage from './pages/DetallePage'
import CarritoPage from './pages/CarritoPage'
import ContactoPage from './pages/ContactoPage'
import PedidosPage from './pages/PedidosPage'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import PagoPage from './pages/PagoPage'
import AdminPage from './pages/AdminPage'

function AppContent() {
  const { toast, showToast } = useToast()

  return (
    <>
      <Navbar showToast={showToast} />
      <main>
        <Routes>
          <Route path="/"           element={<HomePage      showToast={showToast} />} />
          <Route path="/productos"  element={<ProductosPage showToast={showToast} />} />
          <Route path="/detalle/:id" element={<DetallePage  showToast={showToast} />} />
          <Route path="/carrito"    element={<CarritoPage   showToast={showToast} />} />
          <Route path="/contacto"   element={<ContactoPage  showToast={showToast} />} />
          <Route path="/pedidos"    element={<PedidosPage />} />
          <Route path="/login"      element={<LoginPage     showToast={showToast} />} />
          <Route path="/registro"   element={<RegistroPage  showToast={showToast} />} />
          <Route path="/pago" element={<PagoPage showToast={showToast} />} />
          <Route path="/admin" element={<AdminPage showToast={showToast} />} />
        </Routes>
      </main>
      <Footer />
      <Toast message={toast.message} visible={toast.visible} />
    </>
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

import { createContext, useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectUser } from '../store/authSlice'
import { agregarItemCarrito } from '../services/carritoService'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const user = useSelector(selectUser)

  function addToCart(product, cantidad = 1) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, cantidad: i.cantidad + cantidad } : i)
      }
      return [...prev, { ...product, cantidad }]
    })
    if (user) {
      agregarItemCarrito(user.id, product.id, cantidad, user.token).catch(console.error)
    }
  }

  function updateQty(id, cantidad) {
    if (cantidad <= 0) {
      removeItem(id)
      return
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i))
  }

  function removeItem(id) {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  function clearCart() {
    setCart([])
  }

  const cartCount = cart.reduce((acc, i) => acc + i.cantidad, 0)
  const cartTotal = cart.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeItem, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}

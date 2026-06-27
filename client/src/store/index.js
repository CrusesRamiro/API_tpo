import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './themeSlice'
import authReducer from './authSlice'
import cartReducer from './cartSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    cart: cartReducer,
  },
})

// Cachea el carrito en localStorage ante cualquier cambio, así se pinta al
// instante en el próximo F5 (sin esperar al backend). Solo escribe si cambió.
let prevItems
store.subscribe(() => {
  const items = store.getState().cart.items
  if (items !== prevItems) {
    prevItems = items
    localStorage.setItem('cart', JSON.stringify(items))
  }
})

export default store

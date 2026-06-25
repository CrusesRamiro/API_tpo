import { createSlice } from '@reduxjs/toolkit'
import { agregarItemCarrito } from '../services/carritoService'

const initialState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const { product, cantidad = 1 } = action.payload
      const existing = state.items.find(i => i.id === product.id)
      if (existing) {
        existing.cantidad += cantidad
      } else {
        state.items.push({ ...product, cantidad })
      }
    },
    updateQty(state, action) {
      const { id, cantidad } = action.payload
      if (cantidad <= 0) {
        state.items = state.items.filter(i => i.id !== id)
        return
      }
      const item = state.items.find(i => i.id === id)
      if (item) item.cantidad = cantidad
    },
    removeItem(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addItem, updateQty, removeItem, clearCart } = cartSlice.actions

// Thunk: agrega al carrito y, si hay usuario logueado, sincroniza con el back.
// La sync es fire-and-forget (igual que el CartContext original), por eso es un
// thunk simple y no un createAsyncThunk (no hay estado de carga que trackear).
export const addToCart = (product, cantidad = 1) => (dispatch, getState) => {
  dispatch(addItem({ product, cantidad }))
  const user = getState().auth.user
  if (user) {
    agregarItemCarrito(user.id, product.id, cantidad, user.token).catch(console.error)
  }
}

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((acc, i) => acc + i.cantidad, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

export default cartSlice.reducer

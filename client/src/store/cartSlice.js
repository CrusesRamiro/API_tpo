import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  agregarItemCarrito,
  actualizarCantidadCarrito,
  eliminarItemCarrito,
  vaciarCarrito,
  obtenerCarrito,
  checkout,
} from '../services/carritoService'
import { logout } from './authSlice'

// --- Persistencia HÍBRIDA del carrito ---
// El carrito SIEMPRE se cachea en localStorage (clave `cart`) -> se pinta al
const CACHE_KEY = 'cart'

export const loadCachedCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || []
  } catch {
    return []
  }
}

const mapRemoteItems = (carrito) =>
  (carrito.items || []).map((ic) => ({ ...ic.item, cantidad: ic.cantidad }))


export const serverAddItem = createAsyncThunk(
  'cart/serverAddItem',
  async ({ id, cantidad }, { getState }) => {
    const user = getState().auth.user
    if (user) await agregarItemCarrito(user.id, id, cantidad)
  }
)

export const serverChangeQty = createAsyncThunk(
  'cart/serverChangeQty',
  async ({ id, cantidad }, { getState }) => {
    const user = getState().auth.user
    if (!user) return
    if (cantidad <= 0) await eliminarItemCarrito(user.id, id)
    else await actualizarCantidadCarrito(user.id, id, cantidad)
  }
)

export const serverRemoveItem = createAsyncThunk(
  'cart/serverRemoveItem',
  async (id, { getState }) => {
    const user = getState().auth.user
    if (user) await eliminarItemCarrito(user.id, id)
  }
)

export const serverEmptyCart = createAsyncThunk(
  'cart/serverEmptyCart',
  async (_, { getState }) => {
    const user = getState().auth.user
    if (user) await vaciarCarrito(user.id)
  }
)


export const fetchAndMergeCart = createAsyncThunk(
  'cart/fetchAndMerge',
  async (_, { getState }) => {
    const user = getState().auth.user
    if (!user) return null
    const localItems = getState().cart.items
    const remoteItems = mapRemoteItems(await obtenerCarrito(user.id))

    const merged = remoteItems.map((i) => ({ ...i }))
    for (const local of localItems) {
      const existing = merged.find((i) => i.id === local.id)
      if (existing) existing.cantidad += local.cantidad
      else merged.push({ ...local })
    }
    // El back suma al agregar: empujar los locales deja la DB == merge.
    await Promise.all(localItems.map((l) => agregarItemCarrito(user.id, l.id, l.cantidad)))
    return merged
  }
)

export const syncCartFromDB = createAsyncThunk(
  'cart/syncFromDB',
  async (_, { getState }) => {
    const user = getState().auth.user
    if (!user) return null
    return mapRemoteItems(await obtenerCarrito(user.id))
  }
)

export const checkoutCart = createAsyncThunk('cart/checkout', async (_, { getState, dispatch }) => {
  const user = getState().auth.user
  const items = getState().cart.items
  await vaciarCarrito(user.id)
  for (const item of items) {
    await agregarItemCarrito(user.id, item.id, item.cantidad)
  }
  await checkout(user.id)
  dispatch(clearCart())
})

const initialState = {
  items: loadCachedCart(),
  checkoutStatus: 'idle', // idle | loading | succeeded | failed
  checkoutError: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const { product, cantidad = 1 } = action.payload
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) existing.cantidad += cantidad
      else state.items.push({ ...product, cantidad })
    },
    updateQty(state, action) {
      const { id, cantidad } = action.payload
      if (cantidad <= 0) {
        state.items = state.items.filter((i) => i.id !== id)
        return
      }
      const item = state.items.find((i) => i.id === id)
      if (item) item.cantidad = cantidad
    },
    removeItem(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    clearCart(state) {
      state.items = []
    },
    resetCheckout(state) {
      state.checkoutStatus = 'idle'
      state.checkoutError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Al cerrar sesión, el estado local arranca limpio.
      .addCase(logout, (state) => {
        state.items = []
      })
      .addCase(fetchAndMergeCart.fulfilled, (state, action) => {
        if (action.payload) state.items = action.payload
      })
      .addCase(syncCartFromDB.fulfilled, (state, action) => {
        if (action.payload) state.items = action.payload
      })
      // Checkout
      .addCase(checkoutCart.pending, (state) => {
        state.checkoutStatus = 'loading'
        state.checkoutError = null
      })
      .addCase(checkoutCart.fulfilled, (state) => {
        state.checkoutStatus = 'succeeded'
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.checkoutStatus = 'failed'
        state.checkoutError = action.error.message
      })
  },
})

export const { addItem, updateQty, removeItem, clearCart, resetCheckout } = cartSlice.actions


export const addToCart = (product, cantidad = 1) => (dispatch, getState) => {
  dispatch(addItem({ product, cantidad }))
  if (getState().auth.user) dispatch(serverAddItem({ id: product.id, cantidad }))
}

export const changeQty = (id, cantidad) => (dispatch, getState) => {
  dispatch(updateQty({ id, cantidad }))
  if (getState().auth.user) dispatch(serverChangeQty({ id, cantidad }))
}

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch(removeItem(id))
  if (getState().auth.user) dispatch(serverRemoveItem(id))
}

export const emptyCart = () => (dispatch, getState) => {
  dispatch(clearCart())
  if (getState().auth.user) dispatch(serverEmptyCart())
}

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((acc, i) => acc + i.cantidad, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
export const selectCheckoutStatus = (state) => state.cart.checkoutStatus
export const selectCheckoutError = (state) => state.cart.checkoutError

export default cartSlice.reducer
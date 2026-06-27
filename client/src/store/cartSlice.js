import { createSlice } from '@reduxjs/toolkit'
import {
  agregarItemCarrito,
  actualizarCantidadCarrito,
  eliminarItemCarrito,
  vaciarCarrito,
  obtenerCarrito,
} from '../services/carritoService'
import { logout } from './authSlice'

// --- Persistencia HÍBRIDA del carrito ---
// El carrito SIEMPRE se cachea en localStorage (clave `cart`) -> se pinta al
// instante en cada F5, sin esperar al backend (lo persiste un subscribe en
// store/index.js). Logueado, la fuente de verdad es la DB: cada cambio se
// sincroniza con el back y, al recargar, se reconcilia en segundo plano.
// Al loguearse, el carrito local se FUSIONA con el de la DB sumando cantidades.
const CACHE_KEY = 'cart'

export const loadCachedCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || []
  } catch {
    return []
  }
}

const mapRemoteItems = (carrito) =>
  (carrito.items || []).map(ic => ({ ...ic.item, cantidad: ic.cantidad }))

const initialState = {
  items: loadCachedCart(),
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
    // Reemplaza el carrito completo (lo usan el merge y la reconciliación con la DB).
    setCart(state, action) {
      state.items = action.payload
    },
  },
  extraReducers: (builder) => {
    // Al cerrar sesión, el carrito del usuario queda en la DB y el estado local
    // arranca limpio (el subscribe de localStorage refleja el vaciado).
    builder.addCase(logout, (state) => {
      state.items = []
    })
  },
})

export const { addItem, updateQty, removeItem, clearCart, setCart } = cartSlice.actions

// Agrega al carrito. Logueado -> sincroniza con el back (fire-and-forget).
export const addToCart = (product, cantidad = 1) => (dispatch, getState) => {
  dispatch(addItem({ product, cantidad }))
  const user = getState().auth.user
  if (user) {
    agregarItemCarrito(user.id, product.id, cantidad, user.token).catch(console.error)
  }
}

// Cambia la cantidad de un item (0 lo elimina). Logueado -> sincroniza con el back.
export const changeQty = (id, cantidad) => (dispatch, getState) => {
  dispatch(updateQty({ id, cantidad }))
  const user = getState().auth.user
  if (user) {
    const call = cantidad <= 0
      ? eliminarItemCarrito(user.id, id, user.token)
      : actualizarCantidadCarrito(user.id, id, cantidad, user.token)
    call.catch(console.error)
  }
}

// Elimina un item. Logueado -> sincroniza con el back.
export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch(removeItem(id))
  const user = getState().auth.user
  if (user) {
    eliminarItemCarrito(user.id, id, user.token).catch(console.error)
  }
}

// Vacía el carrito completo. Logueado -> sincroniza con el back.
export const emptyCart = () => (dispatch, getState) => {
  dispatch(clearCart())
  const user = getState().auth.user
  if (user) {
    vaciarCarrito(user.id, user.token).catch(console.error)
  }
}

// MERGE al iniciar sesión: fusiona el carrito local con el de la DB SUMANDO
// cantidades por producto. Pinta el resultado al instante (setCart) y empuja los
// items locales al back EN PARALELO, sin bloquear la UI.
export const fetchAndMergeCart = () => async (dispatch, getState) => {
  const user = getState().auth.user
  if (!user) return

  const localItems = getState().cart.items
  try {
    const remoteItems = mapRemoteItems(await obtenerCarrito(user.id, user.token))

    const merged = remoteItems.map(i => ({ ...i }))
    for (const local of localItems) {
      const existing = merged.find(i => i.id === local.id)
      if (existing) existing.cantidad += local.cantidad
      else merged.push({ ...local })
    }

    dispatch(setCart(merged)) // UI instantánea con el carrito fusionado

    // El back suma al agregar: empujar los locales deja la DB == merge.
    Promise.all(
      localItems.map(l => agregarItemCarrito(user.id, l.id, l.cantidad, user.token))
    ).catch(console.error)
  } catch (err) {
    console.error('No se pudo fusionar el carrito con el backend:', err)
  }
}

// RECONCILIACIÓN al recargar estando logueado: trae el carrito de la DB y
// reemplaza el cacheado (NO suma). El cache ya pintó el carrito al instante.
export const syncCartFromDB = () => async (dispatch, getState) => {
  const user = getState().auth.user
  if (!user) return
  try {
    const remoteItems = mapRemoteItems(await obtenerCarrito(user.id, user.token))
    dispatch(setCart(remoteItems))
  } catch (err) {
    console.error('No se pudo sincronizar el carrito con el backend:', err)
  }
}

export const selectCartItems = (state) => state.cart.items
export const selectCartCount = (state) =>
  state.cart.items.reduce((acc, i) => acc + i.cantidad, 0)
export const selectCartTotal = (state) =>
  state.cart.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

export default cartSlice.reducer

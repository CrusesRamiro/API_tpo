import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer, {
  addItem,
  updateQty,
  removeItem,
  clearCart,
  addToCart,
  changeQty,
  removeFromCart,
  emptyCart,
  fetchAndMergeCart,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from './cartSlice'
import authReducer, { logout } from './authSlice'
import {
  agregarItemCarrito,
  actualizarCantidadCarrito,
  eliminarItemCarrito,
  vaciarCarrito,
  obtenerCarrito,
} from '../services/carritoService'


vi.mock('../services/carritoService')

const prod = (id, precio) => ({ id, nombre: `p${id}`, precio })

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('cartSlice reducers', () => {
  it('addItem agrega un producto nuevo', () => {
    const state = cartReducer(undefined, addItem({ product: prod(1, 100), cantidad: 2 }))
    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toMatchObject({ id: 1, cantidad: 2 })
  })

  it('addItem sobre un producto existente suma la cantidad', () => {
    let state = cartReducer(undefined, addItem({ product: prod(1, 100), cantidad: 1 }))
    state = cartReducer(state, addItem({ product: prod(1, 100), cantidad: 3 }))
    expect(state.items).toHaveLength(1)
    expect(state.items[0].cantidad).toBe(4)
  })

  it('updateQty cambia la cantidad', () => {
    let state = cartReducer(undefined, addItem({ product: prod(1, 100), cantidad: 1 }))
    state = cartReducer(state, updateQty({ id: 1, cantidad: 5 }))
    expect(state.items[0].cantidad).toBe(5)
  })

  it('updateQty con cantidad <= 0 elimina el item', () => {
    let state = cartReducer(undefined, addItem({ product: prod(1, 100), cantidad: 1 }))
    state = cartReducer(state, updateQty({ id: 1, cantidad: 0 }))
    expect(state.items).toHaveLength(0)
  })

  it('removeItem saca el item', () => {
    let state = cartReducer(undefined, addItem({ product: prod(1, 100), cantidad: 1 }))
    state = cartReducer(state, addItem({ product: prod(2, 50), cantidad: 1 }))
    state = cartReducer(state, removeItem(1))
    expect(state.items.map(i => i.id)).toEqual([2])
  })

  it('clearCart vacia el carrito', () => {
    let state = cartReducer(undefined, addItem({ product: prod(1, 100), cantidad: 1 }))
    state = cartReducer(state, clearCart())
    expect(state.items).toHaveLength(0)
  })
})

describe('cartSlice selectores derivados', () => {
  const state = {
    cart: { items: [{ id: 1, precio: 100, cantidad: 2 }, { id: 2, precio: 50, cantidad: 1 }] },
  }
  it('selectCartItems devuelve los items', () => {
    expect(selectCartItems(state)).toHaveLength(2)
  })
  it('selectCartCount suma las cantidades', () => {
    expect(selectCartCount(state)).toBe(3)
  })
  it('selectCartTotal suma precio * cantidad', () => {
    expect(selectCartTotal(state)).toBe(250)
  })
})

describe('addToCart (thunk)', () => {
  const makeStore = (user) =>
    configureStore({
      reducer: { cart: cartReducer, auth: authReducer },
      preloadedState: { auth: { user, status: 'idle', error: null }, cart: { items: [] } },
    })

  it('sin usuario: agrega al carrito pero NO sincroniza con el back', () => {
    const store = makeStore(null)
    store.dispatch(addToCart(prod(1, 100), 2))

    expect(selectCartItems(store.getState())).toHaveLength(1)
    expect(agregarItemCarrito).not.toHaveBeenCalled()
  })

  it('con usuario logueado: agrega al carrito Y llama al back', () => {
    const store = makeStore({ id: 7, token: 'jwt' })
    store.dispatch(addToCart(prod(1, 100), 2))

    expect(selectCartCount(store.getState())).toBe(2)
    expect(agregarItemCarrito).toHaveBeenCalledTimes(1)
    expect(agregarItemCarrito).toHaveBeenCalledWith(7, 1, 2) // usuarioId, idItem, cant
  })
})

describe('sincronización con el back (logueado)', () => {
  const makeStore = (user) =>
    configureStore({
      reducer: { cart: cartReducer, auth: authReducer },
      preloadedState: { auth: { user, status: 'idle', error: null }, cart: { items: [] } },
    })

  it('changeQty >0 logueado: actualiza local y actualiza la cantidad en el back', () => {
    const store = makeStore({ id: 7, token: 'jwt' })
    store.dispatch(addItem({ product: prod(1, 100), cantidad: 1 }))
    store.dispatch(changeQty(1, 5))

    expect(selectCartItems(store.getState())[0].cantidad).toBe(5)
    expect(actualizarCantidadCarrito).toHaveBeenCalledWith(7, 1, 5)
    expect(eliminarItemCarrito).not.toHaveBeenCalled()
  })

  it('changeQty 0 logueado: elimina local y elimina el item en el back', () => {
    const store = makeStore({ id: 7, token: 'jwt' })
    store.dispatch(addItem({ product: prod(1, 100), cantidad: 1 }))
    store.dispatch(changeQty(1, 0))

    expect(selectCartItems(store.getState())).toHaveLength(0)
    expect(eliminarItemCarrito).toHaveBeenCalledWith(7, 1)
    expect(actualizarCantidadCarrito).not.toHaveBeenCalled()
  })

  it('removeFromCart invitado: saca local y NO llama al back', () => {
    const store = makeStore(null)
    store.dispatch(addItem({ product: prod(1, 100), cantidad: 1 }))
    store.dispatch(removeFromCart(1))

    expect(selectCartItems(store.getState())).toHaveLength(0)
    expect(eliminarItemCarrito).not.toHaveBeenCalled()
  })

  it('emptyCart logueado: vacía local y vacía el carrito en el back', () => {
    const store = makeStore({ id: 7, token: 'jwt' })
    store.dispatch(addItem({ product: prod(1, 100), cantidad: 2 }))
    store.dispatch(emptyCart())

    expect(selectCartItems(store.getState())).toHaveLength(0)
    expect(vaciarCarrito).toHaveBeenCalledWith(7)
  })

  it('logout vacía el carrito local', () => {
    let state = cartReducer(undefined, addItem({ product: prod(1, 100), cantidad: 2 }))
    state = cartReducer(state, logout())
    expect(state.items).toHaveLength(0)
  })
})

describe('fetchAndMergeCart (fusión invitado + DB)', () => {
  it('suma las cantidades de los productos repetidos entre local y DB', async () => {
    // obtenerCarrito resuelve directamente con el dato (interceptor de axios).
    obtenerCarrito.mockResolvedValue({
      items: [
        { item: prod(1, 100), cantidad: 2 },
        { item: prod(2, 50), cantidad: 1 },
      ],
    })
    agregarItemCarrito.mockResolvedValue({})

    const store = configureStore({
      reducer: { cart: cartReducer, auth: authReducer },
      preloadedState: {
        auth: { user: { id: 7, token: 'jwt' }, status: 'idle', error: null },
        cart: { items: [{ ...prod(1, 100), cantidad: 3 }, { ...prod(3, 25), cantidad: 1 }] },
      },
    })

    await store.dispatch(fetchAndMergeCart())
    const items = selectCartItems(store.getState())

    expect(items.find(i => i.id === 1).cantidad).toBe(5) // 2 (DB) + 3 (local)
    expect(items.find(i => i.id === 2).cantidad).toBe(1) // solo en DB
    expect(items.find(i => i.id === 3).cantidad).toBe(1) // solo local
    // empujó los 2 items locales al back
    expect(agregarItemCarrito).toHaveBeenCalledTimes(2)
  })
})
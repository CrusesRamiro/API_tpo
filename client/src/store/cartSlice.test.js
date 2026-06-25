import { describe, it, expect, vi, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import cartReducer, {
  addItem,
  updateQty,
  removeItem,
  clearCart,
  addToCart,
  selectCartItems,
  selectCartCount,
  selectCartTotal,
} from './cartSlice'
import authReducer from './authSlice'

const prod = (id, precio) => ({ id, nombre: `p${id}`, precio })

afterEach(() => {
  vi.restoreAllMocks()
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
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const store = makeStore(null)
    store.dispatch(addToCart(prod(1, 100), 2))

    expect(selectCartItems(store.getState())).toHaveLength(1)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('con usuario logueado: agrega al carrito Y llama al back', () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
    vi.stubGlobal('fetch', fetchMock)

    const store = makeStore({ id: 7, token: 'jwt' })
    store.dispatch(addToCart(prod(1, 100), 2))

    expect(selectCartCount(store.getState())).toBe(2)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

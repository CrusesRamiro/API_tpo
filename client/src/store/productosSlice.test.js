import { describe, it, expect, vi, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import productosReducer, {
  fetchProductos,
  fetchProductoById,
  addProducto,
  editProducto,
  removeProducto,
  clearSelected,
  selectProductos,
  selectProductoSelected,
  selectProductosLoading,
  selectProductosError,
} from './productosSlice'
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} from '../services/productoService'

// mockeamos el service para controlar que resuelve/rechaza cada thunk
vi.mock('../services/productoService')

const prod = (id, extra = {}) => ({ id, nombre: `p${id}`, precio: id * 10, ...extra })
const makeStore = () => configureStore({ reducer: { productos: productosReducer } })

afterEach(() => {
  vi.resetAllMocks()
})

describe('productosSlice - estado y reducers sincronicos', () => {
  it('estado inicial', () => {
    const state = productosReducer(undefined, { type: '@@INIT' })
    expect(state).toEqual({ items: [], selected: null, loading: false, error: null })
  })

  it('fetchProductos.pending prende loading y limpia error', () => {
    const state = productosReducer({ items: [], selected: null, loading: false, error: 'viejo' }, fetchProductos.pending())
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('clearSelected limpia el producto seleccionado', () => {
    const state = productosReducer({ items: [], selected: prod(1), loading: false, error: null }, clearSelected())
    expect(state.selected).toBeNull()
  })
})

describe('productosSlice - lectura (thunks)', () => {
  it('fetchProductos OK: guarda items y apaga loading', async () => {
    getProductos.mockResolvedValue([prod(1), prod(2)])

    const store = makeStore()
    await store.dispatch(fetchProductos())

    const state = store.getState()
    expect(getProductos).toHaveBeenCalledTimes(1)
    expect(selectProductos(state)).toHaveLength(2)
    expect(selectProductosLoading(state)).toBe(false)
    expect(selectProductosError(state)).toBeNull()
  })

  it('fetchProductos fallido: guarda el error y apaga loading', async () => {
    getProductos.mockRejectedValue(new Error('Servidor caido'))

    const store = makeStore()
    await store.dispatch(fetchProductos())

    const state = store.getState()
    expect(selectProductos(state)).toHaveLength(0)
    expect(selectProductosLoading(state)).toBe(false)
    expect(selectProductosError(state)).toBe('Servidor caido')
  })

  it('fetchProductoById OK: guarda el producto en selected', async () => {
    getProductoById.mockResolvedValue(prod(7, { nombre: 'Vinilo' }))

    const store = makeStore()
    await store.dispatch(fetchProductoById(7))

    expect(getProductoById).toHaveBeenCalledWith(7)
    expect(selectProductoSelected(store.getState())).toMatchObject({ id: 7, nombre: 'Vinilo' })
  })
})

describe('productosSlice - mutaciones (CRUD)', () => {
  it('addProducto OK: llama al service y agrega a la lista', async () => {
    createProducto.mockResolvedValue(prod(3))

    const store = makeStore()
    const data = { nombre: 'p3', precio: 30, stock: 5, categoriaId: 1 }
    await store.dispatch(addProducto(data))

    expect(createProducto).toHaveBeenCalledWith(data)
    expect(selectProductos(store.getState()).map((p) => p.id)).toContain(3)
  })

  it('editProducto OK: llama al service y reemplaza el item por id', async () => {
    getProductos.mockResolvedValue([prod(1), prod(2)])
    updateProducto.mockResolvedValue({ id: 2, nombre: 'editado', precio: 99 })

    const store = makeStore()
    await store.dispatch(fetchProductos()) // precarga [1, 2]
    await store.dispatch(editProducto({ id: 2, data: { nombre: 'editado' } }))

    expect(updateProducto).toHaveBeenCalledWith(2, { nombre: 'editado' })
    const editado = selectProductos(store.getState()).find((p) => p.id === 2)
    expect(editado.nombre).toBe('editado')
  })

  it('removeProducto OK: llama al service y saca el item de la lista', async () => {
    getProductos.mockResolvedValue([prod(1), prod(2)])
    deleteProducto.mockResolvedValue(undefined)

    const store = makeStore()
    await store.dispatch(fetchProductos()) // precarga [1, 2]
    await store.dispatch(removeProducto(1))

    expect(deleteProducto).toHaveBeenCalledWith(1)
    expect(selectProductos(store.getState()).map((p) => p.id)).toEqual([2])
  })
})
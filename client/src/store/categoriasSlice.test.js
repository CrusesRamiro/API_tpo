import { describe, it, expect, vi, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import categoriasReducer, {
  fetchCategorias,
  addCategoria,
  editCategoria,
  selectCategorias,
  selectCategoriasLoading,
  selectCategoriasError,
} from './categoriasSlice'
import {
  getCategorias,
  createCategoria,
  updateCategoria,
} from '../services/categoriaService'

vi.mock('../services/categoriaService')

const cat = (id) => ({ id, nombre: `cat${id}`, descripcion: 'd' })
const makeStore = () => configureStore({ reducer: { categorias: categoriasReducer } })

afterEach(() => {
  vi.resetAllMocks()
})

describe('categoriasSlice', () => {
  it('estado inicial', () => {
    const state = categoriasReducer(undefined, { type: '@@INIT' })
    expect(state).toEqual({ items: [], loading: false, error: null })
  })

  it('fetchCategorias OK: guarda items y apaga loading', async () => {
    getCategorias.mockResolvedValue([cat(1), cat(2)])

    const store = makeStore()
    await store.dispatch(fetchCategorias())

    expect(selectCategorias(store.getState())).toHaveLength(2)
    expect(selectCategoriasLoading(store.getState())).toBe(false)
  })

  it('fetchCategorias fallido: guarda el error', async () => {
    getCategorias.mockRejectedValue(new Error('sin conexion'))

    const store = makeStore()
    await store.dispatch(fetchCategorias())

    expect(selectCategoriasError(store.getState())).toBe('sin conexion')
  })

  it('addCategoria OK: llama al service y agrega a la lista', async () => {
    createCategoria.mockResolvedValue(cat(5))

    const store = makeStore()
    const data = { nombre: 'cat5', descripcion: 'd' }
    await store.dispatch(addCategoria(data))

    expect(createCategoria).toHaveBeenCalledWith(data)
    expect(selectCategorias(store.getState()).map((c) => c.id)).toContain(5)
  })

  it('editCategoria OK: llama al service y reemplaza por id', async () => {
    getCategorias.mockResolvedValue([cat(1), cat(2)])
    updateCategoria.mockResolvedValue({ id: 2, nombre: 'editada', descripcion: 'd' })

    const store = makeStore()
    await store.dispatch(fetchCategorias())
    await store.dispatch(editCategoria({ id: 2, data: { nombre: 'editada' } }))

    expect(updateCategoria).toHaveBeenCalledWith(2, { nombre: 'editada' })
    expect(selectCategorias(store.getState()).find((c) => c.id === 2).nombre).toBe('editada')
  })
})
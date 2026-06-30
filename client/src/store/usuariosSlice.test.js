import { describe, it, expect, vi, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import usuariosReducer, {
  fetchUsuarios,
  selectUsuarios,
  selectUsuariosLoading,
  selectUsuariosError,
} from './usuariosSlice'
import { getAllUsuarios } from '../services/usuarioService'

vi.mock('../services/usuarioService')

const makeStore = () => configureStore({ reducer: { usuarios: usuariosReducer } })

afterEach(() => {
  vi.resetAllMocks()
})

describe('usuariosSlice (solo lectura)', () => {
  it('estado inicial', () => {
    const state = usuariosReducer(undefined, { type: '@@INIT' })
    expect(state).toEqual({ items: [], loading: false, error: null })
  })

  it('fetchUsuarios.pending prende loading', () => {
    const state = usuariosReducer(undefined, fetchUsuarios.pending())
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('fetchUsuarios OK: guarda la lista de usuarios', async () => {
    getAllUsuarios.mockResolvedValue([
      { id: 1, username: 'admin', rol: { nombre: 'ROLE_ADMIN' } },
      { id: 2, username: 'cliente', rol: { nombre: 'ROLE_USER' } },
    ])

    const store = makeStore()
    await store.dispatch(fetchUsuarios())

    expect(getAllUsuarios).toHaveBeenCalledTimes(1)
    expect(selectUsuarios(store.getState())).toHaveLength(2)
    expect(selectUsuariosLoading(store.getState())).toBe(false)
  })

  it('fetchUsuarios fallido: guarda el error', async () => {
    getAllUsuarios.mockRejectedValue(new Error('no autorizado'))

    const store = makeStore()
    await store.dispatch(fetchUsuarios())

    expect(selectUsuariosError(store.getState())).toBe('no autorizado')
  })
})
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import authReducer, {
  loginUser,
  logout,
  clearError,
  selectUser,
  selectIsLoggedIn,
  selectAuthError,
} from './authSlice'

const makeStore = () => configureStore({ reducer: { auth: authReducer } })

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('authSlice reducers sincronicos', () => {
  it('estado inicial: sin usuario, idle, sin error', () => {
    const state = authReducer(undefined, { type: '@@INIT' })
    expect(state.user).toBeNull()
    expect(state.status).toBe('idle')
    expect(state.error).toBeNull()
  })

  it('logout limpia el usuario y el localStorage', () => {
    localStorage.setItem('auth', JSON.stringify({ id: 1 }))
    const logged = { user: { id: 1, username: 'maxi' }, status: 'succeeded', error: null }
    const state = authReducer(logged, logout())
    expect(state.user).toBeNull()
    expect(state.status).toBe('idle')
    expect(localStorage.getItem('auth')).toBeNull()
  })

  it('clearError borra el error', () => {
    const state = authReducer({ user: null, status: 'failed', error: 'mal' }, clearError())
    expect(state.error).toBeNull()
  })
})

describe('loginUser (thunk con fetch mockeado)', () => {
  it('login OK: mapea la respuesta, guarda el usuario y persiste', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ userId: 7, username: 'maxi', rol: 'ROLE_ADMIN', token: 'jwt-123' }),
    }))

    const store = makeStore()
    await store.dispatch(loginUser({ username: 'maxi', password: '1234' }))

    const state = store.getState()
    expect(selectUser(state)).toEqual({ id: 7, username: 'maxi', rol: 'ROLE_ADMIN', token: 'jwt-123' })
    expect(selectIsLoggedIn(state)).toBe(true)
    expect(state.auth.status).toBe('succeeded')
    expect(JSON.parse(localStorage.getItem('auth')).id).toBe(7)
  })

  it('login fallido: guarda el error y no loguea', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

    const store = makeStore()
    await store.dispatch(loginUser({ username: 'x', password: 'mal' }))

    const state = store.getState()
    expect(selectIsLoggedIn(state)).toBe(false)
    expect(state.auth.status).toBe('failed')
    expect(selectAuthError(state)).toBe('Usuario o contraseña incorrectos')
    expect(localStorage.getItem('auth')).toBeNull()
  })

  it('pone status=loading mientras el login esta pendiente', () => {
    const pending = authReducer(undefined, loginUser.pending())
    expect(pending.status).toBe('loading')
    expect(pending.error).toBeNull()
  })
})

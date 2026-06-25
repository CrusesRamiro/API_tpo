import { describe, it, expect, beforeEach } from 'vitest'
import themeReducer, { toggleDark, setDark, selectDarkMode } from './themeSlice'

beforeEach(() => {
  localStorage.clear()
})

describe('themeSlice', () => {
  it('arranca con darkMode en false', () => {
    const state = themeReducer(undefined, { type: '@@INIT' })
    expect(state.darkMode).toBe(false)
  })

  it('toggleDark invierte el valor', () => {
    const off = themeReducer(undefined, { type: '@@INIT' })
    const on = themeReducer(off, toggleDark())
    expect(on.darkMode).toBe(true)
    const offAgain = themeReducer(on, toggleDark())
    expect(offAgain.darkMode).toBe(false)
  })

  it('setDark fija el valor segun el payload', () => {
    const state = themeReducer(undefined, setDark(true))
    expect(state.darkMode).toBe(true)
    expect(themeReducer(state, setDark(false)).darkMode).toBe(false)
  })

  it('toggleDark y setDark persisten en localStorage', () => {
    themeReducer(undefined, toggleDark())
    expect(localStorage.getItem('darkMode')).toBe('true')
    themeReducer(undefined, setDark(false))
    expect(localStorage.getItem('darkMode')).toBe('false')
  })

  it('selectDarkMode lee del state global', () => {
    expect(selectDarkMode({ theme: { darkMode: true } })).toBe(true)
  })
})

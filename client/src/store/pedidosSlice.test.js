import { describe, it, expect, vi, afterEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import pedidosReducer, {
  fetchPedidosByUsuario,
  fetchAllPedidos,
  changeEstadoPedido,
  selectPedidos,
  selectPedidosLoading,
  selectPedidosError,
} from './pedidosSlice'
import {
  getPedidosByUsuario,
  getAllPedidos,
  updateEstadoPedido,
} from '../services/pedidoService'

vi.mock('../services/pedidoService')

const pedido = (id, estado = 'PENDIENTE') => ({ id, estado, total: id * 100, detalle: [] })
const makeStore = () => configureStore({ reducer: { pedidos: pedidosReducer } })

afterEach(() => {
  vi.resetAllMocks()
})

describe('pedidosSlice', () => {
  it('estado inicial', () => {
    const state = pedidosReducer(undefined, { type: '@@INIT' })
    expect(state).toEqual({ items: [], loading: false, error: null })
  })

  it('fetchPedidosByUsuario OK: trae los pedidos del usuario', async () => {
    getPedidosByUsuario.mockResolvedValue([pedido(1), pedido(2)])

    const store = makeStore()
    await store.dispatch(fetchPedidosByUsuario(7))

    expect(getPedidosByUsuario).toHaveBeenCalledWith(7)
    expect(selectPedidos(store.getState())).toHaveLength(2)
    expect(selectPedidosLoading(store.getState())).toBe(false)
  })

  it('fetchAllPedidos OK: trae todos los pedidos (admin)', async () => {
    getAllPedidos.mockResolvedValue([pedido(1), pedido(2), pedido(3)])

    const store = makeStore()
    await store.dispatch(fetchAllPedidos())

    expect(getAllPedidos).toHaveBeenCalledTimes(1)
    expect(selectPedidos(store.getState())).toHaveLength(3)
  })

  it('fetchAllPedidos fallido: guarda el error', async () => {
    getAllPedidos.mockRejectedValue(new Error('error 500'))

    const store = makeStore()
    await store.dispatch(fetchAllPedidos())

    expect(selectPedidosError(store.getState())).toBe('error 500')
  })

  it('changeEstadoPedido OK: llama al service y reemplaza el pedido por id', async () => {
    getAllPedidos.mockResolvedValue([pedido(1, 'PENDIENTE'), pedido(2, 'PENDIENTE')])
    updateEstadoPedido.mockResolvedValue(pedido(2, 'ENVIADO'))

    const store = makeStore()
    await store.dispatch(fetchAllPedidos()) // precarga
    await store.dispatch(changeEstadoPedido({ id: 2, estado: 'ENVIADO' }))

    expect(updateEstadoPedido).toHaveBeenCalledWith(2, 'ENVIADO')
    expect(selectPedidos(store.getState()).find((p) => p.id === 2).estado).toBe('ENVIADO')
  })
})
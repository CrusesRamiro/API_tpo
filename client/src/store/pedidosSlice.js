import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getPedidosByUsuario,
  getAllPedidos,
  updateEstadoPedido,
} from '../services/pedidoService'

// Pedidos del usuario logueado (vista /pedidos)
export const fetchPedidosByUsuario = createAsyncThunk(
  'pedidos/fetchByUsuario',
  (usuarioId) => getPedidosByUsuario(usuarioId)
)

// Todos los pedidos (panel admin)
export const fetchAllPedidos = createAsyncThunk('pedidos/fetchAll', () => getAllPedidos())

// Cambio de estado (admin)
export const changeEstadoPedido = createAsyncThunk('pedidos/changeEstado', ({ id, estado }) =>
  updateEstadoPedido(id, estado)
)

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const pedidosSlice = createSlice({
  name: 'pedidos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Pedidos por usuario
      .addCase(fetchPedidosByUsuario.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPedidosByUsuario.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchPedidosByUsuario.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Todos los pedidos
      .addCase(fetchAllPedidos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllPedidos.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchAllPedidos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Cambio de estado: reemplaza el pedido modificado en la lista
      .addCase(changeEstadoPedido.fulfilled, (state, action) => {
        const i = state.items.findIndex((p) => p.id === action.payload.id)
        if (i !== -1) state.items[i] = action.payload
      })
  },
})

export const selectPedidos = (state) => state.pedidos.items
export const selectPedidosLoading = (state) => state.pedidos.loading
export const selectPedidosError = (state) => state.pedidos.error

export default pedidosSlice.reducer
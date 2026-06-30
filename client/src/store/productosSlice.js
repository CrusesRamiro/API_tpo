import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} from '../services/productoService'

export const fetchProductos = createAsyncThunk('productos/fetchAll', () => getProductos())

export const fetchProductoById = createAsyncThunk('productos/fetchById', (id) => getProductoById(id))

export const addProducto = createAsyncThunk('productos/add', (data) => createProducto(data))

export const editProducto = createAsyncThunk('productos/edit', ({ id, data }) =>
  updateProducto(id, data)
)

export const removeProducto = createAsyncThunk('productos/remove', async (id) => {
  await deleteProducto(id)
  return id // devolvemos el id para sacarlo del estado en el fulfilled
})

const initialState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
}

const productosSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Lectura de todos
      .addCase(fetchProductos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Lectura por id (detalle)
      .addCase(fetchProductoById.pending, (state) => {
        state.loading = true
        state.error = null
        state.selected = null
      })
      .addCase(fetchProductoById.fulfilled, (state, action) => {
        state.loading = false
        state.selected = action.payload
      })
      .addCase(fetchProductoById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Alta
      .addCase(addProducto.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      // Modificación
      .addCase(editProducto.fulfilled, (state, action) => {
        const i = state.items.findIndex((p) => p.id === action.payload.id)
        if (i !== -1) state.items[i] = action.payload
      })
      // Baja
      .addCase(removeProducto.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload)
      })
  },
})

export const { clearSelected } = productosSlice.actions

export const selectProductos = (state) => state.productos.items
export const selectProductoSelected = (state) => state.productos.selected
export const selectProductosLoading = (state) => state.productos.loading
export const selectProductosError = (state) => state.productos.error

export default productosSlice.reducer
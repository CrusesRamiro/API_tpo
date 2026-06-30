import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getCategorias,
  createCategoria,
  updateCategoria,
} from '../services/categoriaService'

export const fetchCategorias = createAsyncThunk('categorias/fetchAll', () => getCategorias())

export const addCategoria = createAsyncThunk('categorias/add', (data) => createCategoria(data))

export const editCategoria = createAsyncThunk('categorias/edit', ({ id, data }) =>
  updateCategoria(id, data)
)

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const categoriasSlice = createSlice({
  name: 'categorias',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(addCategoria.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(editCategoria.fulfilled, (state, action) => {
        const i = state.items.findIndex((c) => c.id === action.payload.id)
        if (i !== -1) state.items[i] = action.payload
      })
  },
})

export const selectCategorias = (state) => state.categorias.items
export const selectCategoriasLoading = (state) => state.categorias.loading
export const selectCategoriasError = (state) => state.categorias.error

export default categoriasSlice.reducer
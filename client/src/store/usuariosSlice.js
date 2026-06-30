import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAllUsuarios } from '../services/usuarioService'

export const fetchUsuarios = createAsyncThunk('usuarios/fetchAll', () => getAllUsuarios())

const initialState = {
  items: [],
  loading: false,
  error: null,
}

const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuarios.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsuarios.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const selectUsuarios = (state) => state.usuarios.items
export const selectUsuariosLoading = (state) => state.usuarios.loading
export const selectUsuariosError = (state) => state.usuarios.error

export default usuariosSlice.reducer
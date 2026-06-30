import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login as apiLogin, register as apiRegister } from '../services/authService'

const savedUser = JSON.parse(localStorage.getItem('auth') || 'null')


export const loginUser = createAsyncThunk('auth/loginUser', async ({ username, password }) => {
  const data = await apiLogin(username, password)
  return { id: data.userId, username: data.username, rol: data.rol, token: data.token }
})

export const registerUser = createAsyncThunk('auth/registerUser', (form) =>
  apiRegister({
    username: form.username,
    nombre: form.nombre,
    apellido: form.apellido,
    email: form.email,
    password: form.password,
    rolId: 2,
  })
)

const initialState = {
  user: savedUser,
  status: 'idle', // idle | loading | succeeded | failed  (login)
  error: null,
  registerStatus: 'idle', // idle | loading | succeeded | failed  (registro)
  registerError: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.status = 'idle'
      state.error = null
      localStorage.removeItem('auth')
    },
    clearError(state) {
      state.error = null
    },
    clearRegisterError(state) {
      state.registerError = null
      state.registerStatus = 'idle'
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
        localStorage.setItem('auth', JSON.stringify(action.payload))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Error al iniciar sesión'
      })
      // Registro
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = 'loading'
        state.registerError = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerStatus = 'succeeded'
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = 'failed'
        state.registerError = action.error.message || 'Error al crear la cuenta'
      })
  },
})

export const { logout, clearError, clearRegisterError } = authSlice.actions

export const selectUser = (state) => state.auth.user
export const selectIsLoggedIn = (state) => state.auth.user !== null
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => state.auth.error
export const selectRegisterStatus = (state) => state.auth.registerStatus
export const selectRegisterError = (state) => state.auth.registerError

export default authSlice.reducer
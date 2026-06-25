import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login as apiLogin } from '../services/authService'

const savedUser = JSON.parse(localStorage.getItem('auth') || 'null')

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const data = await apiLogin(username, password)
      return { id: data.userId, username: data.username, rol: data.rol, token: data.token }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const initialState = {
  user: savedUser,
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
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
  },
  extraReducers: (builder) => {
    builder
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
        state.error = action.payload || 'Error al iniciar sesión'
      })
  },
})

export const { logout, clearError } = authSlice.actions

export const selectUser = (state) => state.auth.user
export const selectIsLoggedIn = (state) => state.auth.user !== null
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => state.auth.error

export default authSlice.reducer

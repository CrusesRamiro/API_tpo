import { isRejected } from '@reduxjs/toolkit'

// Middleware de errores CENTRALIZADO.
// En vez de poner try/catch en cada componente o thunk, escuchamos acá TODOS
// los thunks que terminan en .rejected (createAsyncThunk los marca solo) y
// manejamos el error en un único lugar: log + notificación opcional.
let notify = null
export const setErrorNotifier = (fn) => {
  notify = fn
}

export const errorMiddleware = () => (next) => (action) => {
  if (isRejected(action)) {
    const message = action.error?.message || 'Error inesperado'
    console.error(`[API] ${action.type} → ${message}`)
    if (notify) notify(message)
  }
  return next(action)
}
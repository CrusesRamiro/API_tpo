import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  darkMode: localStorage.getItem('darkMode') === 'true',
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDark(state) {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', String(state.darkMode))
    },
    setDark(state, action) {
      state.darkMode = action.payload
      localStorage.setItem('darkMode', String(action.payload))
    },
  },
})

export const { toggleDark, setDark } = themeSlice.actions

export const selectDarkMode = (state) => state.theme.darkMode

export default themeSlice.reducer

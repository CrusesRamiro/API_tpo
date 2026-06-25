import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  darkMode: false,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDark(state) {
      state.darkMode = !state.darkMode
    },
    setDark(state, action) {
      state.darkMode = action.payload
    },
  },
})

export const { toggleDark, setDark } = themeSlice.actions

export const selectDarkMode = (state) => state.theme.darkMode

export default themeSlice.reducer

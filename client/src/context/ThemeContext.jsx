import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false)

  function toggleDark() {
    setDarkMode(d => !d)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDark }}>
      <div className={`app-wrapper ${darkMode ? 'dark' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
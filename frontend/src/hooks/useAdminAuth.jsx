import { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(() => !!sessionStorage.getItem('mididater_admin'))
  const [credentials, setCredentials] = useState(() => {
    const stored = sessionStorage.getItem('mididater_admin')
    return stored ? JSON.parse(stored) : null
  })

  const login = (username, password) => {
    const creds = { username, password }
    sessionStorage.setItem('mididater_admin', JSON.stringify(creds))
    setCredentials(creds)
    setIsAuth(true)
  }

  const logout = () => {
    sessionStorage.removeItem('mididater_admin')
    setCredentials(null)
    setIsAuth(false)
  }

  const authHeader = credentials
    ? 'Basic ' + btoa(`${credentials.username}:${credentials.password}`)
    : null

  return (
    <AdminAuthContext.Provider value={{ isAuth, login, logout, authHeader, credentials }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}

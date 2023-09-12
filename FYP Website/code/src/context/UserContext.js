// UserContext.js
import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUserContext = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  // Load user data from local storage on component initialization
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Update local storage whenever user data changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

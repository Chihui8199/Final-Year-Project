import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user data from cookies on component initialization
  useEffect(() => {
    const storedUser = Cookies.get('user'); // Changed 'token' to 'user'
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Update cookies whenever user data changes
  useEffect(() => {
    if (user) {
      // stores the entire user information within the cookies
      Cookies.set('user', JSON.stringify(user), { expires: 3 / 24 });
    } else {
      Cookies.remove('user'); // Removed 'user' cookie
    }
  }, [user]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

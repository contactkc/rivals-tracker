import { createContext, useState, useEffect, useContext } from 'react';
import { fetchWithAuth } from '../utils/api';
import { Toaster, toaster } from "@/components/ui/toaster"
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check localStorage for existing user on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    // clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toaster.create({
      title: 'Logout successful',
      description: 'See you next time!',
      type: 'success',
    });
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
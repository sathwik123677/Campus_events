import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const user = await authService.login(credentials);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const user = await authService.register(data);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const updateProfile = async (data) => {
    const updatedUser = await authService.updateProfile(data);
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

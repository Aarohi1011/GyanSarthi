import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      // Ensure user has proper structure
      const userWithDefaults = {
        ...parsedUser,
        following: parsedUser.following || [],
        followers: parsedUser.followers || []
      };
      setUser(userWithDefaults);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    // Ensure user has proper structure
    const userWithDefaults = {
      ...userData,
      following: userData.following || [],
      followers: userData.followers || []
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithDefaults));
    setUser(userWithDefaults);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
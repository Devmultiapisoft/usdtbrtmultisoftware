import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      // The Authorization header is now handled by the api interceptor
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };

  // Load user
  const loadUser = async () => {
    if (token) {
      setAuthToken(token);

      try {
        const res = await api.get('/api/auth/me');

        if (res.data.status) {
          setUser(res.data.data);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
          setAuthToken(null);
        }
      } catch (err) {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        setAuthToken(null);
      }
    }

    setLoading(false);
  };

  // Register user
  const register = async (formData) => {
    try {
      const res = await api.post('/api/auth/register', formData);

      if (res.data.status) {
        setToken(res.data.token);
        setAuthToken(res.data.token);
        await loadUser();
        return { success: true };
      } else {
        setError(res.data.message);
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      const message = err.response && err.response.data.message
        ? err.response.data.message
        : 'Registration failed';

      setError(message);
      return { success: false, message };
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      const res = await api.post('/api/auth/login', formData);

      if (res.data.status) {
        setToken(res.data.token);
        setAuthToken(res.data.token);
        await loadUser();
        return { success: true };
      } else {
        setError(res.data.message);
        return { success: false, message: res.data.message };
      }
    } catch (err) {
      const message = err.response && err.response.data.message
        ? err.response.data.message
        : 'Login failed';

      setError(message);
      return { success: false, message };
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setAuthToken(null);
  };

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        loadUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

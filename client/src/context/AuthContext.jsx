import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('physiocare_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('physiocare_token');
            setUser(null);
          }
        } catch {
          localStorage.removeItem('physiocare_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (userIdOrEmail, password, endpoint = '/auth/login') => {
    try {
      const response = await api.post(endpoint, {
        userId: userIdOrEmail,
        email: userIdOrEmail,
        password
      });
      if (response.data.success) {
        const { token, user: loggedUser } = response.data;
        localStorage.setItem('physiocare_token', token);
        setUser(loggedUser);
        return { success: true, user: loggedUser };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid User ID or password.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('physiocare_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        role: user?.role || null,
        therapistId: user?.therapistId || null,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

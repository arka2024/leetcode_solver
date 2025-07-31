import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User {
  _id: string;
  username: string;
  email: string;
  profile: {
    firstName?: string;
    lastName?: string;
    institution?: string;
    country?: string;
  };
  stats: {
    problemsSolved: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    rating: number;
  };
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error loading user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login({ username, password });
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData);
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData: any) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
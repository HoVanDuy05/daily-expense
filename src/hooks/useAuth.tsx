'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check token and fetch profile on mount
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const cachedUser = localStorage.getItem('user');

      if (storedToken && cachedUser) {
        // Use cached data without API check
        setUser(JSON.parse(cachedUser));
        setToken(storedToken);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Mock successful login for now
      const mockUser = {
        id: '1',
        name: 'User',
        email: email,
        avatar: undefined,
      };

      const mockToken = 'mock-token-' + Date.now();

      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Lỗi đăng nhập' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // Mock successful registration for now
      const mockUser = {
        id: '1',
        name: name,
        email: email,
        avatar: undefined,
      };

      const mockToken = 'mock-token-' + Date.now();

      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Lỗi đăng ký' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userCacheTime');
    router.push('/login');
  };

  const forgotPassword = async (email: string) => {
    return { success: true, message: 'Kiểm tra email để đặt lại mật khẩu' };
  };

  const resetPassword = async (token: string, password: string) => {
    return { success: true, message: 'Đặt lại mật khẩu thành công' };
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

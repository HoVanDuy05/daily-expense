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
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        // Check if we have cached user data
        const cachedUser = localStorage.getItem('user');
        const cachedTime = localStorage.getItem('userCacheTime');
        const now = Date.now();

        // Use cached data if less than 5 minutes old
        if (cachedUser && cachedTime && (now - parseInt(cachedTime)) < 300000) {
          setUser(JSON.parse(cachedUser));
          setToken(storedToken);
          setIsLoading(false);
          return;
        }

        try {
          const response = await fetch('http://localhost:8000/api/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Accept': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUser(data.data);
              setToken(storedToken);
              // Cache user data
              localStorage.setItem('user', JSON.stringify(data.data));
              localStorage.setItem('userCacheTime', now.toString());
            } else {
              // Token invalid, remove it
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('userCacheTime');
            }
          } else {
            // Token invalid, remove it
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userCacheTime');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          // Don't remove token on network error, just use cached data if available
          if (cachedUser) {
            setUser(JSON.parse(cachedUser));
            setToken(storedToken);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('userCacheTime', Date.now().toString());
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Đăng nhập thất bại' };
      }
    } catch (error) {
      return { success: false, message: 'Lỗi kết nối đến server' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, message: data.message || 'Đăng ký thành công' };
      } else {
        return { success: false, message: data.message || 'Đăng ký thất bại' };
      }
    } catch (error) {
      return { success: false, message: 'Lỗi kết nối đến server' };
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
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: data.message || (response.ok ? 'Email đã được gửi' : 'Gửi email thất bại')
      };
    } catch (error) {
      return { success: false, message: 'Lỗi kết nối' };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: data.message || (response.ok ? 'Đặt lại mật khẩu thành công' : 'Đặt lại mật khẩu thất bại')
      };
    } catch (error) {
      return { success: false, message: 'Lỗi kết nối' };
    }
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

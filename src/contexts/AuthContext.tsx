import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (user: User, rememberMe: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // 페이지 로드 시 localStorage에서 사용자 정보 확인
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // isAuthenticated 계산
  const isAuthenticated = user !== null;

  const login = (userData: User, rememberMe: boolean) => {
    setUser(userData);
    if (rememberMe) {
      // rememberMe가 true일 경우 localStorage에 저장
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      // rememberMe가 false일 경우 sessionStorage에 저장
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  };

  useEffect(() => {
    // sessionStorage에서 사용자 정보 확인
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser && !user) {
      setUser(JSON.parse(sessionUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
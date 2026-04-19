import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '../api';
import { getAuthToken, setAuthToken } from '../api/axios';
import { User } from '../types/domain';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  loginUser: (token: string, user: User) => void;
  logoutUser: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Refreshes the authenticated profile from the backend when a token exists.
   */
  const refreshUser = useCallback(async () => {
    if (!getAuthToken()) {
      return;
    }

    try {
      const { data } = await getCurrentUser();
      setUser(data.user);
    } catch {
      setAuthToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  /**
   * Persists the new session token and caches the returned user profile.
   */
  const loginUser = (token: string, nextUser: User) => {
    setAuthToken(token);
    setUser(nextUser);
  };

  /**
   * Clears the current session on manual logout.
   */
  const logoutUser = () => {
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const contextValue = useContext(AuthContext);

  if (!contextValue) {
    throw new Error('useAuth must be inside AuthProvider');
  }

  return contextValue;
};

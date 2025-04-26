"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User, AuthResponse, UserLogin, UserCreate } from "../types/api";
import { TokenStore } from "./tokenStore";
import { apiService } from "../api/apiService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: UserLogin) => Promise<boolean>;
  register: (userData: UserCreate) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check for existing tokens and load user data on mount
  useEffect(() => {
    const initAuth = async () => {
      if (TokenStore.hasTokens()) {
        try {
          // Try to get current user data
          const userData = await apiService.request<User>("/users/me", {
            isProtected: true,
          });
          setUser(userData);
        } catch (err) {
          // If getting user data fails, try to refresh the token
          try {
            const refreshed = await apiService.refreshToken();
            if (refreshed) {
              // If refresh succeeds, try to get user data again
              const userData = await apiService.request<User>("/users/me", {
                isProtected: true,
              });
              setUser(userData);
            } else {
              // If refresh fails, clear tokens
              TokenStore.clearTokens();
            }
          } catch (refreshErr) {
            // If refresh throws an error, clear tokens
            TokenStore.clearTokens();
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: UserLogin): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.request<AuthResponse>("/auth/login", {
        method: "POST",
        body: credentials,
        isProtected: false,
      });

      // Store tokens and user data
      TokenStore.setTokens(response.tokens);
      setUser(response.user);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: UserCreate): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.request<AuthResponse>(
        "/auth/register",
        {
          method: "POST",
          body: userData,
          isProtected: false,
        },
      );

      // Store tokens and user data
      TokenStore.setTokens(response.tokens);
      setUser(response.user);
      setIsLoading(false);
      return true;
    } catch (err) {
      setError((err as Error).message);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    TokenStore.clearTokens();
    setUser(null);
    router.push("/login");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

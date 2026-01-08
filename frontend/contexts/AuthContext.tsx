"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useUser as useAuth0User } from "@auth0/nextjs-auth0/client";
import { getCurrentUser, type User } from "@/services/users.service";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  getToken: () => Promise<string | null>;
  refetch: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: auth0User, isLoading: auth0IsLoading } = useAuth0User();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Get fresh access token for API calls
   * The Next.js Auth0 SDK stores the access token in the session
   * We can retrieve it from the /api/auth/me endpoint
   */
  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        console.error("Failed to get user session");
        return null;
      }

      const session = await response.json();
      return session.accessToken || null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }, []);

  /**
   * Fetch user from backend when Auth0 authentication completes
   * Backend will auto-create user if first login
   */
  const fetchBackendUser = useCallback(async () => {
    if (!auth0User) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        console.error("No access token available");
        setUser(null);
        return;
      }

      // Backend will auto-create user if first login
      const backendUser = await getCurrentUser(token);
      setUser(backendUser);
    } catch (error) {
      console.error("Failed to fetch backend user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [auth0User, getToken]);

  // Fetch backend user when Auth0 auth state changes
  useEffect(() => {
    if (!auth0IsLoading) {
      if (auth0User) {
        fetchBackendUser();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    }
  }, [auth0User, auth0IsLoading, fetchBackendUser]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading: isLoading || auth0IsLoading,
        getToken,
        refetch: fetchBackendUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

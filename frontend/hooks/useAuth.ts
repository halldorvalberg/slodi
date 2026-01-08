import { useAuth as useAuthContext } from "@/contexts/AuthContext";

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 */
export function useAuth() {
  return useAuthContext();
}

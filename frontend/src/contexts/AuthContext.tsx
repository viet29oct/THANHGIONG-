import { createContext, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiUser } from "@/lib/api/types";
import { authApi } from "@/lib/api/auth";

type AuthContextValue = {
  user: ApiUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        return await authApi.me();
      } catch {
        return null;
      }
    },
    enabled: typeof window !== "undefined",
    retry: false,
    staleTime: 60_000,
  });

  const login = async (email: string, password: string) => {
    await authApi.login({ email, password });
    await qc.invalidateQueries({ queryKey: ["auth"] });
  };

  const logout = async () => {
    await authApi.logout();
    qc.setQueryData(["auth", "me"], null);
    qc.setQueryData(["cart"], null);
    await qc.invalidateQueries({ queryKey: ["auth"] });
    await qc.invalidateQueries({ queryKey: ["cart"] });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        login,
        logout,
        refresh: () => void refetch(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

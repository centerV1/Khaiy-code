"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authApi } from "@/lib/api/auth";
import type {
  AuthStatus,
  LoginPayload,
  SessionUser,
  SignupPayload,
} from "@/lib/types/store";

type AuthContextValue = {
  user: SessionUser | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<SessionUser>;
  signup: (payload: SignupPayload) => Promise<SessionUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  async function refreshSession() {
    try {
      const nextUser = await authApi.getSession();
      setUser(nextUser);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("guest");
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshSession();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  async function login(payload: LoginPayload) {
    const response = await authApi.login(payload);
    setUser(response.user);
    setStatus("authenticated");
    return response.user;
  }

  async function signup(payload: SignupPayload) {
    const response = await authApi.signup(payload);
    setUser(response.user);
    setStatus("authenticated");
    return response.user;
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
    setStatus("guest");
  }

  const value: AuthContextValue = {
    user,
    status,
    isAuthenticated: status === "authenticated",
    login,
    signup,
    logout,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

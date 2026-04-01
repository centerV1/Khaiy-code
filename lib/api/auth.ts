import { apiFetch } from "@/lib/api/fetcher";
import type {
  AuthResponse,
  LoginPayload,
  SessionUser,
  SignupPayload,
} from "@/lib/types/store";

export const authApi = {
  getSession() {
    return apiFetch<SessionUser>("/auth/me");
  },
  login(payload: LoginPayload) {
    return apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    });
  },
  signup(payload: SignupPayload) {
    return apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: payload,
    });
  },
  logout() {
    return apiFetch<{ message: string }>("/auth/logout", {
      method: "POST",
    });
  },
};

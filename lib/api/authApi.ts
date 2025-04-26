import { apiService } from "./apiService";
import type {
  AuthResponse,
  UserCreate,
  UserLogin,
  UserRefreshToken,
} from "../types/api";

export const authApi = {
  /**
   * Register a new user
   */
  register(userData: UserCreate): Promise<AuthResponse> {
    return apiService.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: userData,
      isProtected: false,
    });
  },

  /**
   * Login a user
   */
  login(credentials: UserLogin): Promise<AuthResponse> {
    return apiService.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: credentials,
      isProtected: false,
    });
  },

  /**
   * Refresh tokens
   */
  refreshToken(
    refreshToken: string,
  ): Promise<{ tokens: AuthResponse["tokens"] }> {
    const data: UserRefreshToken = { refreshToken };
    return apiService.request<{ tokens: AuthResponse["tokens"] }>(
      "/auth/refresh",
      {
        method: "POST",
        body: data,
        isProtected: false,
        isRefreshRequest: true,
      },
    );
  },
};

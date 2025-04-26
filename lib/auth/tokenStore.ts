import type { TokenResponse } from "../types/api"

const ACCESS_TOKEN_KEY = "health_access_token"
const REFRESH_TOKEN_KEY = "health_refresh_token"

export const TokenStore = {
  /**
   * Store both access and refresh tokens in localStorage
   */
  setTokens(tokens: TokenResponse): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access.token)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh.token)
  },

  /**
   * Get the stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  /**
   * Get the stored refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  /**
   * Check if both tokens exist
   */
  hasTokens(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken()
  },

  /**
   * Remove both tokens from localStorage
   */
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

import { TokenStore } from "../auth/tokenStore"
import type { TokenResponse, UserRefreshToken } from "../types/api"

const API_BASE_URL = "http://localhost:3001/v1"

interface ApiOptions {
  method?: string
  body?: any
  headers?: Record<string, string>
  isProtected?: boolean
  isRefreshRequest?: boolean
}

interface ApiError extends Error {
  status?: number
  data?: any
}

/**
 * Main API service for making HTTP requests
 */
export const apiService = {
  /**
   * Make an API request with automatic token handling
   */
  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = "GET", body, headers = {}, isProtected = true, isRefreshRequest = false } = options

    // Prepare URL and headers
    const url = `${API_BASE_URL}${endpoint}`
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    }

    // Add authorization header for protected routes
    if (isProtected && !isRefreshRequest) {
      const token = TokenStore.getAccessToken()
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    }

    try {
      // Make the request
      const response = await fetch(url, requestOptions)

      // Handle successful responses
      if (response.ok) {
        // For 204 No Content responses, return empty object
        if (response.status === 204) {
          return {} as T
        }
        return (await response.json()) as T
      }

      // Handle 401 Unauthorized errors (except for refresh token requests)
      if (response.status === 401 && isProtected && !isRefreshRequest) {
        try {
          // Try to refresh the token
          const refreshed = await this.refreshToken()
          if (refreshed) {
            // Retry the original request with the new token
            return this.request<T>(endpoint, options)
          }
        } catch (refreshError) {
          // If refresh fails, clear tokens and throw error
          TokenStore.clearTokens()
          throw createApiError("Session expired. Please log in again.", 401)
        }
      }

      // Handle other errors
      const errorData = await response.json().catch(() => ({}))
      throw createApiError(errorData.message || "An error occurred", response.status, errorData)
    } catch (error) {
      // Re-throw API errors or wrap other errors
      if ((error as ApiError).status) {
        throw error
      }
      throw createApiError(`Network error: ${(error as Error).message}`, 0)
    }
  },

  /**
   * Refresh the access token using the refresh token
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = TokenStore.getRefreshToken()
    if (!refreshToken) {
      return false
    }

    try {
      const refreshData: UserRefreshToken = {
        refreshToken,
      }

      const response = await this.request<{ tokens: TokenResponse }>("/auth/refresh", {
        method: "POST",
        body: refreshData,
        isProtected: false,
        isRefreshRequest: true,
      })

      // Store the new tokens
      TokenStore.setTokens(response.tokens)
      return true
    } catch (error) {
      return false
    }
  },
}

/**
 * Create a standardized API error
 */
function createApiError(message: string, status?: number, data?: any): ApiError {
  const error = new Error(message) as ApiError
  error.status = status
  error.data = data
  return error
}

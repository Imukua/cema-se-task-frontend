"use client";

import { useState, useCallback } from "react";
import { apiService } from "../api/apiService";
import { useAuth } from "./useAuth";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiResponse<T> extends ApiState<T> {
  execute: (endpoint: string, options?: any) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook for making API requests with loading and error states
 */
export function useAPI<T = any>(): UseApiResponse<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { logout } = useAuth();

  const execute = useCallback(
    async (endpoint: string, options = {}): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await apiService.request<T>(endpoint, options);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const apiError = error as Error;

        // If the error is a 401 and token refresh failed, logout the user
        if ((apiError as any).status === 401) {
          logout();
        }

        setState({ data: null, loading: false, error: apiError });
        return null;
      }
    },
    [logout],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

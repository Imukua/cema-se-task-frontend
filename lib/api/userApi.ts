import { apiService } from "./apiService";
import type { User, UserUpdate, PaginatedResponse } from "../types/api";

export const userApi = {
  /**
   * Get all users with pagination
   */
  getUsers(
    page = 1,
    limit = 10,
    search?: string,
    sortBy?: string,
  ): Promise<PaginatedResponse<User>> {
    let query = `?page=${page}&limit=${limit}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    if (sortBy) query += `&sortBy=${encodeURIComponent(sortBy)}`;

    return apiService.request<PaginatedResponse<User>>(`/users${query}`);
  },

  /**
   * Get a user by ID
   */
  getUser(userId: string): Promise<User> {
    return apiService.request<User>(`/users/${userId}`);
  },

  /**
   * Update a user
   */
  updateUser(userId: string, userData: UserUpdate): Promise<User> {
    return apiService.request<User>(`/users/${userId}`, {
      method: "PATCH",
      body: userData,
    });
  },

  /**
   * Delete a user
   */
  deleteUser(userId: string): Promise<void> {
    return apiService.request<void>(`/users/${userId}`, {
      method: "DELETE",
    });
  },
};

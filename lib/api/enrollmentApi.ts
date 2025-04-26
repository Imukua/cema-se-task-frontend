import { apiService } from "./apiService";
import type {
  Enrollment,
  EnrollmentCreate,
  EnrollmentUpdate,
  PaginatedResponse,
} from "../types/api";

export const enrollmentApi = {
  /**
   * Create a new enrollment
   */
  createEnrollment(enrollmentData: EnrollmentCreate): Promise<Enrollment> {
    return apiService.request<Enrollment>("/enrollments", {
      method: "POST",
      body: enrollmentData,
    });
  },

  /**
   * Get all enrollments with pagination and filtering
   */
  getEnrollments(
    page = 1,
    limit = 10,
    clientId?: string,
    programId?: string,
    status?: "active" | "completed" | "dropped",
    sortBy?: string
  ): Promise<PaginatedResponse<Enrollment>> {
    let query = `?page=${page}&limit=${limit}`;
    if (clientId) query += `&clientId=${encodeURIComponent(clientId)}`;
    if (programId) query += `&programId=${encodeURIComponent(programId)}`;
    if (status) query += `&status=${encodeURIComponent(status)}`;
    if (sortBy) query += `&sortBy=${encodeURIComponent(sortBy)}`;

    return apiService.request<PaginatedResponse<Enrollment>>(
      `/enrollments${query}`
    );
  },

  /**
   * Get enrollments for a specific client
   */
  getClientEnrollments(
    clientId: string,
    page = 1,
    limit = 10,
    sortBy?: string
  ): Promise<PaginatedResponse<Enrollment>> {
    let query = `?page=${page}&limit=${limit}`;
    if (sortBy) query += `&sortBy=${encodeURIComponent(sortBy)}`;

    return apiService.request<PaginatedResponse<Enrollment>>(
      `/enrollments/client/${clientId}${query}`
    );
  },

  getEnrollmentById(enrollmentId: string): Promise<Enrollment> {
    return apiService.request<Enrollment>(`/enrollments/${enrollmentId}`);
  },
  /**
   * Update an enrollment
   */
  updateEnrollment(
    enrollmentId: string,
    enrollmentData: EnrollmentUpdate
  ): Promise<Enrollment> {
    return apiService.request<Enrollment>(`/enrollments/${enrollmentId}`, {
      method: "PATCH",
      body: enrollmentData,
    });
  },

  /**
   * Delete an enrollment
   */
  deleteEnrollment(enrollmentId: string): Promise<void> {
    return apiService.request<void>(`/enrollments/${enrollmentId}`, {
      method: "DELETE",
    });
  },
};

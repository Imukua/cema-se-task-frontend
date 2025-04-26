import { apiService } from "./apiService"
import type { HealthProgram, HealthProgramCreate, HealthProgramUpdate, PaginatedResponse } from "../types/api"

export const programApi = {
  /**
   * Create a new health program
   */
  createProgram(programData: HealthProgramCreate): Promise<HealthProgram> {
    return apiService.request<HealthProgram>("/programs", {
      method: "POST",
      body: programData,
    })
  },

  /**
   * Get all health programs with pagination and filtering
   */
  getPrograms(page = 1, limit = 10, search?: string, sortBy?: string): Promise<PaginatedResponse<HealthProgram>> {
    let query = `?page=${page}&limit=${limit}`
    if (search) query += `&search=${encodeURIComponent(search)}`
    if (sortBy) query += `&sortBy=${encodeURIComponent(sortBy)}`

    return apiService.request<PaginatedResponse<HealthProgram>>(`/programs${query}`)
  },

  /**
   * Get a health program by ID
   */
  getProgram(programId: string): Promise<HealthProgram> {
    return apiService.request<HealthProgram>(`/programs/${programId}`)
  },

  /**
   * Update a health program
   */
  updateProgram(programId: string, programData: HealthProgramUpdate): Promise<HealthProgram> {
    return apiService.request<HealthProgram>(`/programs/${programId}`, {
      method: "PATCH",
      body: programData,
    })
  },

  /**
   * Delete a health program
   */
  deleteProgram(programId: string): Promise<void> {
    return apiService.request<void>(`/programs/${programId}`, {
      method: "DELETE",
    })
  },
}

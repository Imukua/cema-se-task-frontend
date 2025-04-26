import { apiService } from "./apiService";
import type {
  Client,
  ClientCreate,
  ClientUpdate,
  ClientStatistics,
  PaginatedResponse,
} from "../types/api";

export const clientApi = {
  /**
   * Create a new client
   */
  createClient(clientData: ClientCreate): Promise<Client> {
    return apiService.request<Client>("/clients", {
      method: "POST",
      body: clientData,
    });
  },

  /**
   * Get all clients with pagination and filtering
   */
  getClients(
    page = 1,
    limit = 10,
    search?: string,
    gender?: string,
    sortBy?: string,
  ): Promise<PaginatedResponse<Client>> {
    let query = `?page=${page}&limit=${limit}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    if (gender) query += `&gender=${encodeURIComponent(gender)}`;
    if (sortBy) query += `&sortBy=${encodeURIComponent(sortBy)}`;

    return apiService.request<PaginatedResponse<Client>>(`/clients${query}`);
  },

  /**
   * Get client statistics
   */
  getClientStatistics(): Promise<ClientStatistics> {
    return apiService.request<ClientStatistics>("/clients/statistics");
  },

  /**
   * Get a client by ID
   */
  getClient(clientId: string): Promise<Client> {
    return apiService.request<Client>(`/clients/${clientId}`);
  },

  /**
   * Update a client
   */
  updateClient(clientId: string, clientData: ClientUpdate): Promise<Client> {
    return apiService.request<Client>(`/clients/${clientId}`, {
      method: "PATCH",
      body: clientData,
    });
  },

  /**
   * Delete a client
   */
  deleteClient(clientId: string): Promise<void> {
    return apiService.request<void>(`/clients/${clientId}`, {
      method: "DELETE",
    });
  },
};

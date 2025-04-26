// Common types
export interface PaginatedResponse<T> {
  results: T[];
  totalResults: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}

// Auth types
export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRefreshToken {
  refreshToken: string;
}

export interface TokenResponse {
  access: {
    token: string;
  };
  refresh: {
    token: string;
  };
}

export interface AuthResponse {
  user: User;
  tokens: TokenResponse;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  password?: string;
  role?: "ADMIN" | "USER";
}

// Client types
export interface Client {
  id: string;
  fullName: string;
  dob: string;
  gender: string;
  contact: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  programs?: Enrollment[];
}

export interface ClientCreate {
  fullName: string;
  dob: string;
  gender: string;
  contact: string;
  notes?: string | null;
}

export interface ClientUpdate {
  fullName?: string;
  dob?: string;
  gender?: string;
  contact?: string;
  notes?: string | null;
}

export interface ClientStatistics {
  client: {
    total: number;
    recent: RecentClient[];
  };
  programs: {
    total: number;
  };
  enrollments: {
    total: number;
    distribution: {
      active: number;
      completed: number;
      dropped: number;
    };
  };
}

export interface RecentClient {
  id: string;
  fullName: string;
  createdAt: string;
}

// Health Program types
export interface HealthProgram {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HealthProgramCreate {
  name: string;
  description?: string | null;
}

export interface HealthProgramUpdate {
  name?: string;
  description?: string | null;
}

// Enrollment types
export interface Enrollment {
  id: string;
  clientId: string;
  programId: string;
  enrolledAt: string;
  status: "active" | "completed" | "dropped";
  notes: string | null;
  client?: Client;
  healthProgram?: HealthProgram;
}

export interface EnrollmentCreate {
  clientId: string;
  programId: string;
  status: "active" | "completed" | "dropped";
  notes?: string | null;
}

export interface EnrollmentUpdate {
  status?: "active" | "completed" | "dropped";
  notes?: string | null;
}

export type Program = HealthProgram;
